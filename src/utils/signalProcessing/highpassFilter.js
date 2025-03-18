import { getAudioContext } from '../audioUtils';

/**
 * high pass filter params
 * @param {number} frequency
 * @param {number} Q
 * @returns {BiquadFilterNode}
 */
export const createHighPassFilter = (frequency = 1000, Q = 1) => {
    const audioContext = getAudioContext();
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    return filter;
};