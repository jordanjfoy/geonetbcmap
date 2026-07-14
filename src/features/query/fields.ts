import type { Field, FullField, RuleType } from 'react-querybuilder';
import { defaultOperators, toFullOption } from 'react-querybuilder';
import { SymbologyGroups } from './symbology_groups';

export const validator = (r: RuleType) => !!r.value;

export const fields: FullField[] = (
  [
    {
      name: 'GCM_NUMBER',
      label: 'GCM Number',
      placeholder: 'Enter GCM number',
      validator,
    },
    {
      name: 'LATITUDE_DEGREES',
      label: 'Latitude (Degrees)',
      placeholder: 'Enter latitude',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LATITUDE_MINUTES',
      label: 'Latitude (Minutes)',
      placeholder: 'Enter latitude minutes',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LATITUDE_SECONDS',
      label: 'Latitude (Seconds)',
      placeholder: 'Enter latitude seconds',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LONGITUDE_DEGREES',
      label: 'Longitude (Degrees)',
      placeholder: 'Enter longitude',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LONGITUDE_MINUTES',
      label: 'Longitude (Minutes)',
      placeholder: 'Enter longitude minutes',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LONGITUDE_SECONDS',
      label: 'Longitude (Seconds)',
      placeholder: 'Enter longitude seconds',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'SYMBOLOGY_TYPE',
      label: 'Symbology',
      valueEditorType: 'select',
      values: SymbologyGroups,
      operators: defaultOperators.filter((op) => op.name === '='),
      defaultValue: false,
    },
    {
      name: 'TABLET_MARKING',
      label: 'Tablet Marking',
      placeholder: 'Enter tablet marking',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'MUNICIPALITY_NAME',
      label: 'Municipality Name',
      placeholder: 'Enter municipality name',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'MASCOTW_GCM_QUERY_URL',
      label: 'GCM Query URL',
      placeholder: 'Enter GCM query URL',
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'OBJECTID',
      label: 'Object ID',
      placeholder: 'Enter object ID',
      defaultOperator: 'equals',
      validator,
    }  
    
  ] satisfies Field[]
).map((o) => toFullOption(o));