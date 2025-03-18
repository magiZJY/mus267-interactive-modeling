import React from 'react';

const FrequencyInput = ({ frequency, onFrequencyChange }) => {
    return (
        <label>
            Frequency (Hz):
            <input
                type="number"
                min="20"
                max="20000"
                value={frequency}
                onChange={(e) => onFrequencyChange(parseFloat(e.target.value))}
            />
        </label>
    );
};

export default FrequencyInput;