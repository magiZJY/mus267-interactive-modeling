import React from 'react';

const FilterControls = ({ filterName, frequency, setFrequency, Q, setQ }) => {
    return (
        <div className="filter-controls">
            <h2>{filterName} Filter</h2>
            <label>
                Cutoff Frequency:
                <input
                    type="range"
                    min="10"
                    max="2000"
                    value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                />
                {frequency} Hz
            </label>
            <label>
                Q Factor:
                <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={Q}
                    onChange={(e) => setQ(parseFloat(e.target.value))}
                />
                {Q}
            </label>
        </div>
    );
};

export default FilterControls;
