import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const WaveformVisualization = ({ analyserNode }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (analyserNode && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Time-Domain Waveform',
                            data: [],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            pointRadius: 0.3,
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true, // Show x-axis
                            title: {
                                display: true,
                                text: 'Time (samples)', // X-axis label
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Amplitude',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                            min: -1, // Minimum amplitude
                            max: 1, // Maximum amplitude
                        },
                    },
                },
            });

            const bufferLength = analyserNode.fftSize;
            const dataArray = new Float32Array(bufferLength);

            const drawWaveform = () => {
                requestAnimationFrame(drawWaveform);

                analyserNode.getFloatTimeDomainData(dataArray);

                // Update chart data
                chart.data.labels = Array.from({ length: bufferLength }, (_, i) => i);
                chart.data.datasets[0].data = Array.from(dataArray);
                chart.update();
            };

            drawWaveform();
        }
    }, [analyserNode]);

    return (
        <div style={{ width: '100%', height: '200px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default WaveformVisualization;