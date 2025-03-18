import { getAudioContext } from '../audioUtils';

/**
 * Bandpass filter params
 * @param {number} frequency
 * @param {number} Q - The Q factor (resonance).
 * @returns {BiquadFilterNode}
 */
export const createBandpassFilter = (frequency = 1000, Q = 1) => { // default values
    const audioContext = getAudioContext();
    // use a bi-quad filter to create a bandpass filter
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    return filter;
};