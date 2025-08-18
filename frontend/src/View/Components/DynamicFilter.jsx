import React from "react";

const DynamicFilter = ({ showtitle, filters, values, onChange }) => {
  
  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };

  return (
    <div
      className="filter-group"
      style={showtitle ? { display: "flex", flexDirection: "column", gap: "0.5rem" } : {}}
    >
      {filters.map(({ title, label, name, options }) => {
        // FIXED: Remove "All year" option and filter out invalid options
        let filteredOptions = options || [];
        
        // Remove "All year" option if it exists
        if (name === 'year') {
          filteredOptions = filteredOptions.filter(opt => 
            opt !== 'All year' && 
            opt !== 'all' && 
            opt !== '' &&
            opt !== null &&
            opt !== undefined
          );
        }
        


        return (
          <div key={name}>
            {showtitle && <h3>{title}</h3>}
            <select
              value={values[name] || 'all'}
              onChange={(e) => handleSelectChange(name, e.target.value)}
              className="filter-select"
            >
              <option value="all">All {label}</option>
              {filteredOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicFilter;