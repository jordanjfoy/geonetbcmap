
/* FeatureForm.tsx */
import React, { useState } from "react";

export const FeatureForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Feature</h2>

      <div>
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button type="submit">
        Save
      </button>
    </form>
  );
};
