import React, { useState, useRef, useEffect } from 'react';
import LowPassFilter from '../components/SignalProcessor/Filter/LowPassFilter';
import HighPassFilter from '../components/SignalProcessor/Filter/HighPassFilter';
import BandPassFilter from '../components/SignalProcessor/Filter/BandPassFilter';
import FilterControls from '../components/SignalProcessor/Filter/FilterControls';
import NoteTable from '../components/SignalProcessor/Filter/NoteTable';
import FrequencyInput from '../components/SignalProcessor/Filter/FrequencyInput';
import WaveformVisualization from '../components/SignalProcessor/Filter/WaveformVisualization';
import ZoomedWaveformVisualization from '../components/SignalProcessor/Filter/ZoomedWaveformVisualization';
import FrequencyMagnitudeVisualization from '../components/SignalProcessor/Filter/FrequencyMagnitudeVisualization';
import './Filters.css';

const Filters = () => {
    const [lowPassFrequency, setLowPassFrequency] = useState(1000); // Low-pass cutoff frequency
    const [lowPassQ, setLowPassQ] = useState(1); // Low-pass Q factor
    const [highPassFrequency, setHighPassFrequency] = useState(500); // High-pass cutoff frequency
    const [highPassQ, setHighPassQ] = useState(1); // High-pass Q factor
    const [bandPassFrequency, setBandPassFrequency] = useState(1000); // Bandpass center frequency
    const [bandPassQ, setBandPassQ] = useState(1); // Bandpass Q factor
    const [oscillatorFrequency, setOscillatorFrequency] = useState(440); // Oscillator frequency (default: A4)
    const [isAudioReady, setIsAudioReady] = useState(false); // Track audio context readiness

    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const lowPassFilterRef = useRef(null);
    const highPassFilterRef = useRef(null);
    const bandPassFilterRef = useRef(null);
    const analyserRef = useRef(null); // Analyser for time-domain visualization
    const frequencyAnalyserRef = useRef(null); // Analyser for frequency-domain visualization
    const gainRef = useRef(null); // Gain node for volume control

    const initializeAudio = () => {
        // Initialize audio context
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio context initialized:', audioContextRef.current);
        // Create an oscillator
        sourceRef.current = audioContextRef.current.createOscillator();
        sourceRef.current.type = 'sawtooth'; // Use a sine wave for a softer sound
        sourceRef.current.frequency.value = oscillatorFrequency; // Set initial frequency

        gainRef.current = audioContextRef.current.createGain();
        gainRef.current.gain.value = 0.5; // Reduce volume to 50%

        // Create filters
        lowPassFilterRef.current = audioContextRef.current.createBiquadFilter();
        lowPassFilterRef.current.type = 'lowpass';
        lowPassFilterRef.current.frequency.value = lowPassFrequency;
        lowPassFilterRef.current.Q.value = lowPassQ;

        highPassFilterRef.current = audioContextRef.current.createBiquadFilter();
        highPassFilterRef.current.type = 'highpass';
        highPassFilterRef.current.frequency.value = highPassFrequency;
        highPassFilterRef.current.Q.value = highPassQ;

        bandPassFilterRef.current = audioContextRef.current.createBiquadFilter();
        bandPassFilterRef.current.type = 'bandpass';
        bandPassFilterRef.current.frequency.value = bandPassFrequency;
        bandPassFilterRef.current.Q.value = bandPassQ;

        // Create analyser nodes for visualization
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048; // Set FFT size for time-domain visualization

        frequencyAnalyserRef.current = audioContextRef.current.createAnalyser();
        frequencyAnalyserRef.current.fftSize = 2048; // Set FFT size for frequency-domain visualization

        // Connect the audio nodes
        sourceRef.current.connect(lowPassFilterRef.current);
        lowPassFilterRef.current.connect(highPassFilterRef.current);
        highPassFilterRef.current.connect(bandPassFilterRef.current);
        bandPassFilterRef.current.connect(gainRef.current); // Connect to gain node
        gainRef.current.connect(analyserRef.current); // Connect gain to time-domain analyser
        gainRef.current.connect(frequencyAnalyserRef.current); // Connect gain to frequency-domain analyser
        analyserRef.current.connect(audioContextRef.current.destination);

        // Start the oscillator
        sourceRef.current.start();

        // Mark audio as ready
        setIsAudioReady(true);
    };

    const stopAudio = () => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsAudioReady(false);
    };

    const handleNoteSelection = (frequency) => {
        setOscillatorFrequency(frequency);
        if (sourceRef.current) {
            sourceRef.current.frequency.value = frequency; // Update oscillator frequency
        }
    };

    const handleCustomFrequency = (frequency) => {
        if (!isNaN(frequency)) {
            setOscillatorFrequency(frequency);
            if (sourceRef.current) {
                sourceRef.current.frequency.value = frequency; // Update oscillator frequency
            }
        }
    };

    return (
        <div className="filters-page">
            <h1>Filters</h1>
            {!isAudioReady ? (
                <button onClick={initializeAudio}>Start Audio</button>
            ) : (
                <div className="scrollable-content">
                    <button onClick={stopAudio}>Stop Audio</button>

                    <h2>Select a Note</h2>
                    <NoteTable onNoteSelect={handleNoteSelection} />

                    <h2>Custom Frequency</h2>
                    <FrequencyInput
                        frequency={oscillatorFrequency}
                        onFrequencyChange={handleCustomFrequency}
                    />

                    <h2>Time-Domain Waveform</h2>
                    <WaveformVisualization analyserNode={analyserRef.current} />

                    <h2>Frequency Magnitude</h2>
                    <FrequencyMagnitudeVisualization analyserNode={frequencyAnalyserRef.current} />

                    <h2>Zoomed Time-Domain Waveform (256–512 samples)</h2>
                    <ZoomedWaveformVisualization analyserNode={analyserRef.current} />

                    <div className="filter-section">
                        <FilterControls
                            filterName="Low-Pass"
                            frequency={lowPassFrequency}
                            setFrequency={setLowPassFrequency}
                            Q={lowPassQ}
                            setQ={setLowPassQ}
                        />
                        <LowPassFilter
                            frequency={lowPassFrequency}
                            Q={lowPassQ}
                            audioContext={audioContextRef.current}
                            inputNode={sourceRef.current}
                            outputNode={highPassFilterRef.current}
                        />
                    </div>

                    <div className="filter-section">
                        <FilterControls
                            filterName="High-Pass"
                            frequency={highPassFrequency}
                            setFrequency={setHighPassFrequency}
                            Q={highPassQ}
                            setQ={setHighPassQ}
                        />
                        <HighPassFilter
                            frequency={highPassFrequency}
                            Q={highPassQ}
                            audioContext={audioContextRef.current}
                            inputNode={lowPassFilterRef.current}
                            outputNode={bandPassFilterRef.current}
                        />
                    </div>

                    <div className="filter-section">
                        <FilterControls
                            filterName="Bandpass"
                            frequency={bandPassFrequency}
                            setFrequency={setBandPassFrequency}
                            Q={bandPassQ}
                            setQ={setBandPassQ}
                        />
                        <BandPassFilter
                            frequency={bandPassFrequency}
                            Q={bandPassQ}
                            audioContext={audioContextRef.current}
                            inputNode={highPassFilterRef.current}
                            outputNode={gainRef.current}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters;