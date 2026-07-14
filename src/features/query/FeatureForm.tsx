import { useState } from 'react';
import type { RuleGroupType, RuleType } from 'react-querybuilder';
import { QueryBuilder } from 'react-querybuilder';
import { fields } from './fields';
import 'react-querybuilder/dist/query-builder.css';
import './query_styles.css';

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };
const WFS_URL = 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP/ows?';

const operatorMap: Record<string, string> = {
  equals: '=',
  notEqual: '!=',
  lessThan: '<',
  lessThanOrEqual: '<=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
};

const formatValue = (value: unknown): string => {
  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (value === null || value === undefined || value === '') {
    return '';
  }

  const text = String(value).trim();
  return `'${text.replace(/'/g, "''")}'`;
};

const buildCqlFilter = (group: RuleGroupType): string | null => {
  const clauses = group.rules
    .map((rule) => {
      if ('rules' in rule) {
        const nestedFilter = buildCqlFilter(rule);
        return nestedFilter ? `(${nestedFilter})` : null;
      }

      const field = rule.field;
      const operator = rule.operator ?? 'equals';
      const rawValue = rule.value;

      if (!field || rawValue === null || rawValue === undefined || rawValue === '') {
        return null;
      }

      const cqlOperator = operatorMap[operator] ?? '=';
      const valueText = formatValue(rawValue);

      if (operator === 'contains') {
        const escaped = String(rawValue).trim().replace(/'/g, "''");
        return `${field} LIKE '%${escaped}%'`;
      }

      if (operator === 'beginsWith') {
        const escaped = String(rawValue).trim().replace(/'/g, "''");
        return `${field} LIKE '${escaped}%'`;
      }

      if (operator === 'endsWith') {
        const escaped = String(rawValue).trim().replace(/'/g, "''");
        return `${field} LIKE '%${escaped}'`;
      }

      return `${field} ${cqlOperator} ${valueText}`;
    })
    .filter((clause): clause is string => Boolean(clause));

  if (clauses.length === 0) {
    return null;
  }

  return clauses.join(` ${group.combinator.toUpperCase()} `);
};

export const WfsQuery = () => {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRunQuery = async () => {
    const cqlFilter = buildCqlFilter(query);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP',
      outputFormat: 'application/json',
      srsName: 'EPSG:3857',
      maxFeatures: '50',
    });

    if (cqlFilter) {
      params.set('cql_filter', cqlFilter);
    }

    const requestUrl = `${WFS_URL}${params.toString()}`;
    setIsLoading(true);
    setStatus(cqlFilter ? `Sending filter: ${cqlFilter}` : 'Sending unfiltered WFS request...');

    try {
      const response = await fetch(requestUrl, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WFS request failed with ${response.status}`);
      }

      const data = await response.json();
      const featureCount = Array.isArray(data?.features) ? data.features.length : 0;
      setStatus(`Loaded ${featureCount} feature${featureCount === 1 ? '' : 's'} from the WFS service.`);
      console.log('WFS query result:', data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown WFS error';
      setStatus(message);
      console.error('WFS query failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="query-builder-container">
      <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />

      <div className="query-action-bar">
        <button type="button" className="query-submit-button" onClick={handleRunQuery} disabled={isLoading}>
          {isLoading ? 'Loading…' : 'Run WFS query'}
        </button>
        {status ? <p className="query-status-text">{status}</p> : null}
      </div>
    </div>
  );
};

