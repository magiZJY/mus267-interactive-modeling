/**
 * Creates an audio context
 * @returns {AudioContext} The audio context.
 */
export const getAudioContext = () => {
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return window.audioContext;
};
