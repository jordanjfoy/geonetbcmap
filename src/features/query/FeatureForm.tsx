
import React, { useState } from "react";


const fields = [
  "GCM_NUMBER",
  "LATITUDE_DEGREES",
  "LATITUDE_MINUTES",
  "LATITUDE_SECONDS",
  "LONGITUDE_DEGREES",
  "LONGITUDE_MINUTES",
  "LONGITUDE_SECONDS",
  "SYMBOLOGY_TYPE",
  "TABLET_MARKING",
  "MUNICIPALITY_NAME",
  "MASCOTW_GCM_QUERY_URL",
  "OBJECTID"
];

export default function WfsQuery() {
  const [query, setQuery] = useState({
    field: "GCM_NUMBER",
    operator: "=",
    value: ""
  });

  const [results, setResults] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setQuery((prev) => ({
      ...prev,
      value
    }));
  };

  const runQuery = async () => {
    let cqlFilter = "";

    switch (query.operator) {
      case "LIKE":
        cqlFilter = `${query.field} LIKE '%${query.value}%'`;
        break;

      default:
        cqlFilter = `${query.field} ${query.operator} '${query.value}'`;
        break;
    }

    console.log("CQL Filter:", cqlFilter);

    const url =
      'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP/ows?' +
      'service=WFS&version=2.0.0&request=GetFeature' +
      '&typeName=WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP' +
      '&outputFormat=application/json' + 
      `CQL_FILTER=${encodeURIComponent(cqlFilter)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      setResults(data);

      console.log(data);
    } catch (error) {
      console.error("Query failed:", error);
    }
  };

  return (
    <div>
      <h3>Query Layer</h3>

      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center"
        }}
      >
        <select
          name="field"
          value={query.field}
          onChange={handleChange}
        >
          {fields.map((field) => (
            <option
              key={field}
              value={field}
            >
              {field}
            </option>
          ))}
        </select>

        <select
          name="operator"
          value={query.operator}
          onChange={handleChange}
        >
          <option value="=">=</option>
          <option value="<>">!=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="LIKE">Contains</option>
        </select>

        <input
          type="text"
          name="value"
          value={query.value}
          onChange={handleChange}
          placeholder="Enter value..."
        />

        <button onClick={runQuery}>
          Query
        </button>
      </div>

      {results && (
        <div style={{ marginTop: "1rem" }}>
          <h4>
            Features Returned: {results.features?.length ?? 0}
          </h4>

          <pre>
            {JSON.stringify(results.features, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
