import { Fragment, Key, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { QueryBuilder } from 'react-querybuilder';
import { fields } from './fields';
import 'react-querybuilder/dist/query-builder.css';
import './query_styles.css';

type FeatureRow = {
  id: string;
  properties: Record<string, unknown>;
};

const initialQuery: RuleGroupType = { combinator: 'and', rules: [
      {
      field: 'GCM_NUMBER',
      operator: 'equals',
      value: '',
    }
] };
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
  const [rows, setRows] = useState<FeatureRow[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRunQuery = async () => {
    const cqlFilter = buildCqlFilter(query);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: 'WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP',
      outputFormat: 'application/json',
      srsName: 'EPSG:3857',
      maxFeatures: '50',
    });

    if (cqlFilter) {
      params.set('cql_filter', cqlFilter);
    }

    const requestUrl = `${WFS_URL}${params.toString()}`;
    setIsLoading(true);
    setRows([]);
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
      const features = Array.isArray(data?.features) ? data.features : [];
      const featureRows = features.map((feature: { id?: string; properties?: Record<string, unknown> }) => ({
        id: typeof feature.id === 'string' ? feature.id : `feature-${Math.random().toString(36).slice(2)}`,
        properties: feature.properties ?? {},
      }));

      setRows(featureRows);
      setSelectedRowId(null);
      setStatus(
        featureRows.length > 0
          ? `Returned ${featureRows.length} GCM${featureRows.length === 1 ? '' : 's'} from the WFS service.`
          : 'No records matched the current filter.'
      );
      console.log('WFS query result:', data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown WFS error';
      setStatus(message);
      console.error('WFS query failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const LABELS: Record<string, string> = {
      GCM_NUMBER:'GCM Number',
      LATITUDE_DEGREES: 'Latitude (Degrees)',
      LATITUDE_MINUTES: 'Latitude (Minutes)',   
      LATITUDE_SECONDS: 'Latitude (Seconds)',
      LONGITUDE_DEGREES:'Longitude (Degrees)',     
      LONGITUDE_MINUTES: 'Longitude (Minutes)',
      LONGITUDE_SECONDS: 'Longitude (Seconds)',  
      SYMBOL_TYPE: 'Symbology',
      MARKER_TAG: 'Tablet Marking',
      MUNICIPALITY_NAME: 'Municipality Name',
      GEONETBC_GCM_QUERY_URL: 'GCM Query URL',
      OBJECTID: 'Object ID'
  }

  
  return (
    <div className="query-builder-container">
       
      <QueryBuilder 
        fields={fields} 
        query={query} 
        onQueryChange={setQuery} 
      />

      <div className="query-action-bar">
        <button type="button" className="query-submit-button" onClick={handleRunQuery} disabled={isLoading}>
          {isLoading ? 'Loading…' : 'Run WFS query'}
        </button>
        {status ? <p className="query-status-text">{status}</p> : null}
        {rows.length > 0 ? (
          <div className="query-results-list">
            <strong>Returned GCMs</strong>
            <ul className="query-gcm-list">
              {rows.map((row) => {
                const gcmValue = row.properties.GCM_NUMBER ?? row.properties.gcm_number ?? row.properties.GCM ?? row.properties.gcm;
                const label = gcmValue == null ? 'Unknown GCM' : String(gcmValue);

                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      className="query-gcm-button"
                      onClick={() => setSelectedRowId(row.id === selectedRowId ? null : row.id)}
                    >
                      {label}
                    </button>
                    {selectedRowId === row.id ? (
                      <div className="query-results-table-wrapper">
                        <table className="query-results-table">
                          <thead>
                            <tr>
                              <th>Attribute</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(row.properties).map(([key, value]) => (
                              <tr key={`${row.id}-${key}`}>
                                <td>{LABELS[key] ?? key}</td>
                                <td>
                                  {key === 'GEONETBC_GCM_QUERY_URL' ? (
                                    <a
                                      href={String(value)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Open Link
                                    </a>
                                  ) : (
                                    String(value ?? '')
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};


   
    
