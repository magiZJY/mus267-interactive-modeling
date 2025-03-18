import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const ZoomedWaveformVisualization = ({ analyserNode }) => {
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
                            label: 'Zoomed Time-Domain Waveform (256–512 samples)',
                            data: [],
                            borderColor: 'rgba(255, 99, 132, 1)', // Red color for distinction
                            borderWidth: 1,
                            fill: false,
                            pointRadius: 0.3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Time (samples)',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                            // TODO: zoom in range, change if effect not obvious enough on presentation 
                            min: 256,
                            max: 512,
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
                            min: -0.5,
                            max: 0.5,
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

export default ZoomedWaveformVisualization;