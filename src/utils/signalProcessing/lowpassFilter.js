import { getAudioContext } from '../audioUtils';

/**
 * low pass filter.
 * @param {number} frequency
 * @param {number} Q - The Q factor
 * @returns {BiquadFilterNode}
 */
export const createLowPassFilter = (frequency = 1000, Q = 1) => {
    const audioContext = getAudioContext();
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    return filter;
};