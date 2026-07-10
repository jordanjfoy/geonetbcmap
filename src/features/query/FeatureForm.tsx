
/* FeatureForm.tsx */
import { Select } from "antd";
import React, { useState } from "react";

export const FeatureForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted:", formData);

    // Save to API or OL feature properties here
  };

  
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
    "GEOMETRY",
    "OBJECTID",
    "SE_ANNO_CAD_DATA"
  ];


  return (
    <form onSubmit={handleSubmit}>
      <h3>Query</h3>

      <div>
        <select
          name="field"
          value={formData.name}
          onChange={handleChange}
        >
          <option value="">Select a field</option>
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>

      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <button type="submit">
        Search
      </button>
    </form>
  );
};
