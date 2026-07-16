import type { Field, FullField, RuleType } from 'react-querybuilder';
import { defaultOperators, toFullOption } from 'react-querybuilder';
import { SymbologyGroups } from './symbology_groups';

export const validator = (r: RuleType) => !!r.value;

export const num_operators = defaultOperators.filter((op) => ['=', '!=', '<', '<=', '>', '>='].includes(op.name));

export const fields: FullField[] = (
  [
    {
      name: 'GCM_NUMBER',
      label: 'GCM Number',
      placeholder: 'Enter GCM number',
      operators : num_operators,
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LATITUDE_DEGREES',
      label: 'Latitude (Degrees)',
      placeholder: 'Enter latitude',
      operators : num_operators,
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LATITUDE_MINUTES',
      label: 'Latitude (Minutes)',
      placeholder: 'Enter latitude minutes',
      operators : num_operators,
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LATITUDE_SECONDS',
      label: 'Latitude (Seconds)',
      placeholder: 'Enter latitude seconds',
      operators : num_operators,
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LONGITUDE_DEGREES',
      label: 'Longitude (Degrees)',
      placeholder: 'Enter longitude',
      operators : num_operators,
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LONGITUDE_MINUTES',
      label: 'Longitude (Minutes)',
      placeholder: 'Enter longitude minutes',
      operators : num_operators,
      defaultOperator: 'equals',
      validator,
    },
    {
      name: 'LONGITUDE_SECONDS',
      label: 'Longitude (Seconds)',
      placeholder: 'Enter longitude seconds',
      operators : num_operators,
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
     /*This is a string value */
      name: 'MUNICIPALITY_NAME',
      label: 'Municipality Name',
      placeholder: 'Enter municipality name',
      defaultOperator: 'equals',
      validator,
    },
    {
      /*This is a string value */
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