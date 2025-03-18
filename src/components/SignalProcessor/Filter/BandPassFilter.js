import React, { useRef, useEffect } from 'react';

const BandPassFilter = ({ frequency, Q, audioContext, inputNode, outputNode }) => {
    const filterRef = useRef(null);

    useEffect(() => {
        if (audioContext && inputNode && outputNode) {
            // Create the bandpass filter
            filterRef.current = audioContext.createBiquadFilter();
            filterRef.current.type = 'bandpass';
            filterRef.current.frequency.value = frequency;
            filterRef.current.Q.value = Q;

            // Connect the filter between the input and output nodes
            inputNode.connect(filterRef.current);
            filterRef.current.connect(outputNode);
        }
        return () => {
            if (filterRef.current) {
                filterRef.current.disconnect();
            }
        };
    }, [frequency, Q, audioContext, inputNode, outputNode]);

    return null;
};

export default BandPassFilter;