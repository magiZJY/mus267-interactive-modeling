import React, { useState, useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import useAudioContext from '../../../hooks/useAudioContext';
import { karplusStrong } from '../../../utils/signalProcessing/karplusStrong';
import './KarplusStrong.css';

const KarplusStrong = () => {
    // control params
    const [frequency, setFrequency] = useState(440); // Default frequency to A4
    const [duration, setDuration] = useState(1.0);
    const [useFractionalDelay, setUseFractionalDelay] = useState(false);
    const [useCircularBuffer, setUseCircularBuffer] = useState(false);
    const [bufferSize, setBufferSize] = useState(1024);

    const [feedbackGain, setFeedbackGain] = useState(0.5);
    const [damping, setDamping] = useState(0.99);
    const [pluckingStrength, setPluckingStrength] = useState(0.5);
     // Low-pass filter cutoff
    const [filterCutoff, setFilterCutoff] = useState(5000);

    const noiseCanvasRef = useRef(null);
    const waveCanvasRef = useRef(null);
    const chartRef = useRef(null);
    const audioContext = useAudioContext();
    const timeOut = useCircularBuffer ? 200 : 100;

    useEffect(() => {
        // Initialize Chart.js
        const ctx = waveCanvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Generated Sound Wave',
                        data: [],
                        borderColor: 'rgba(255, 0, 128, 0.8)',
                        borderWidth: 1,
                        pointRadius: 0.3,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Amplitude',
                        },
                        min: -1,
                        max: 1,
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const handlePlay = () => {

      const { source, noiseBuffer, analyser } = karplusStrong(
        audioContext,
        frequency,
        duration,
        useFractionalDelay,
        useCircularBuffer,
        bufferSize,
        feedbackGain,
        damping,
        pluckingStrength,
        filterCutoff
    );
  
      // Visualize the initial noise buffer
      visualizeBuffer(noiseBuffer);
  
      // Start the sound
      source.start();
      source.stop(audioContext.currentTime + duration);
  
      const visualize = () => {
          const waveData = new Float32Array(analyser.fftSize);
          // console.log('WaveData:', waveData);
          // Add a small delay before capturing waveData
          setTimeout(() => {
              analyser.getFloatTimeDomainData(waveData);

              console.log('WaveData:', waveData);
  
              // Update chart data
              if (waveData.some(v => v !== 0)) { // Only update if there's non-zero data
                  const labels = Array.from({ length: waveData.length }, (_, i) => i);
                  // console.log('Labels:', labels);
                  chartRef.current.data.labels = labels;
                  chartRef.current.data.datasets[0].data = Array.from(waveData);
                  chartRef.current.update();
              }
  
              // Continue updating until sound stops
              if (audioContext.currentTime < source.stopTime) {
                  requestAnimationFrame(visualize);
              }
          }, timeOut); // Delay of 100ms
      };
  
      visualize();
  };
  const visualizeBuffer = (buffer) => {
    const canvas = noiseCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = buffer.length;
    const barWidth = width / bufferLength;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 128, 255, 0.5)';
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = buffer[i] * (height / 2); // Scale the amplitude to fit in chart
        ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
    // Add label for noise buffer
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText('Initial Noise Buffer', 10, 20);

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Time (samples)', width / 2 - 40, height - 10); // place on the bottom

    ctx.save();
    ctx.translate(10, height / 2);
    // ctx.rotate(-Math.PI / 2); 
    ctx.rotate(-Math.PI / 2); // Need to rotate the context by -90 degrees
    ctx.fillText('Amplitude', 0, 0);
    ctx.restore();
};

return (
  <div className="scrollable-content">
  <div className="karplus-strong">
      <h2>Karplus-Strong Algorithm</h2>
      <div className="controls">
          <label>
              Frequency (Hz):
              <input
                  type="range"
                  min="100"
                  max="1000"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value))}
              />
              {frequency} Hz
          </label>
          <p className="parameter-info">
              Adjusts the pitch of the sound. Higher values produce higher-pitched tones.
          </p>

          <label>
              Duration (s):
              <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
              {duration} s
          </label>
          {/* <p className="parameter-info">
              Controls how long the note sustains before fading out.
          </p> */}

          <label>
              Circular Buffer Length:
              <input
                  type="number"
                  min="128"
                  max="8192"
                  step="128"
                  value={bufferSize}
                  onChange={(e) => setBufferSize(parseInt(e.target.value))}
              />
          </label>
          <p className="parameter-info">
              Determines the delay line size. Larger values produce lower-pitched sounds.
          </p>

          <label>
              Feedback Gain:
              <input
                  type="range"
                  min="0.1"
                  max="0.99"
                  step="0.01"
                  value={feedbackGain}
                  onChange={(e) => setFeedbackGain(parseFloat(e.target.value))}
              />
              {feedbackGain}
          </label>
          <p className="parameter-info">
              Controls how much of the previous output is fed back into the loop. Higher values sustain the sound longer.
          </p>

          <label>
              Damping Factor:
              <input
                  type="range"
                  min="0.8"
                  max="0.999"
                  step="0.001"
                  value={damping}
                  onChange={(e) => setDamping(parseFloat(e.target.value))}
              />
              {damping}
          </label>
          <p className="parameter-info">
              Determines how quickly the high frequencies decay. Higher damping removes brightness over time.
          </p>

          <label>
              Plucking Strength:
              <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={pluckingStrength}
                  onChange={(e) => setPluckingStrength(parseFloat(e.target.value))}
              />
              {pluckingStrength}
          </label>
          <p className="parameter-info">
              Controls the initial energy of the pluck. Higher values make the sound louder and more percussive.
          </p>

          <label>
              Filter Cutoff (Hz):
              <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={filterCutoff}
                  onChange={(e) => setFilterCutoff(parseFloat(e.target.value))}
              />
              {filterCutoff} Hz
          </label>
          <p className="parameter-info">
              Determines how much high-frequency content is allowed. Lower values make the sound warmer, while higher values keep more brightness.
          </p>

          <button onClick={handlePlay}>Play</button>

          <label>
              Use Fractional Delay:
              <input
                  type="checkbox"
                  checked={useFractionalDelay}
                  onChange={(e) => setUseFractionalDelay(e.target.checked)}
              />
          </label>
          <p className="parameter-info">
              Enables fractional delay, which can improve pitch accuracy.
          </p>

          <label>
              Use Circular Buffer:
              <input
                  type="checkbox"
                  checked={useCircularBuffer}
                  onChange={(e) => setUseCircularBuffer(e.target.checked)}
              />
          </label>
          <p className="parameter-info">
              Uses a circular buffer for more efficient memory usage in the delay loop.
          </p>
      </div>

      <div className="visualizations">
          <div>
              <h3>Initial Noise Buffer</h3>
              <canvas ref={noiseCanvasRef} width="800" height="200"></canvas>
          </div>
          <div>
              <h3>Generated Sound Wave</h3>
              <canvas ref={waveCanvasRef} width="800" height="200"></canvas>
          </div>
      </div>
  </div>
  </div>
);

};

export default KarplusStrong;