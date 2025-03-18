import React, { useRef, useEffect } from 'react';

const HighPassFilter = ({ frequency, Q, audioContext, inputNode, outputNode }) => {
    const filterRef = useRef(null);

    useEffect(() => {
        if (audioContext && inputNode && outputNode) {
            filterRef.current = audioContext.createBiquadFilter();
            filterRef.current.type = 'highpass';
            filterRef.current.frequency.value = frequency;
            filterRef.current.Q.value = Q;

            // Connect nodes
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

export default HighPassFilter;