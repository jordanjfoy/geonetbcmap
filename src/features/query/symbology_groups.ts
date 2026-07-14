import type { OptionGroup } from 'react-querybuilder';

export const SymbologyGroups: OptionGroup[] = [
  {
    label: 'Symbology_Type',
    options: [
      '1 - Published GCM (GPS, or GPS and Terrestrial)',
      '2 - Published Provincial Benchmark (except GPS)',
      '3 - Published Federal Benchmark (except GPS)',
      '4 - Non-published GCM (Low horizontal accuracy)',
      '5 - Published CGM (Terrestrial only)',
      '6 - Non-published GCM, Preliminary',
      '7 - Destroyed GCM'
    ],
  }
].map(({ label, options }) => ({
  label,
  options: options.map((s) => ({
    name: s.toLowerCase().replace(/\s+/g, '_'),
    label: s,
  })),
}));