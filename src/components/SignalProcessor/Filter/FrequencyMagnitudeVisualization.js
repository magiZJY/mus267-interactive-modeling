import React, { useRef, useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';

const FrequencyMagnitudeVisualization = ({ analyserNode }) => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const dataArrayRef = useRef(null);

    useEffect(() => {
        if (analyserNode && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Frequency Magnitude',
                            data: [],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: 'logarithmic',
                            title: {
                                display: true,
                                text: 'Frequency (Hz)',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Magnitude (dB)',
                            },
                            min: -100, // Minimum magnitude in dB
                            max: 0, // Maximum magnitude
                        },
                    },
                },
            });

            setChartInstance(chart);

            dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);

            const updateChart = () => {
                if (analyserNode && chart) {

                    analyserNode.getByteFrequencyData(dataArrayRef.current);

                    const frequencyData = Array.from(dataArrayRef.current).map((value) => {
                        return 20 * Math.log10(value / 255); // Convert to dB
                    });

                    const sampleRate = analyserNode.context.sampleRate;
                    const frequencyLabels = frequencyData.map((_, index) => {
                        return (index * sampleRate) / analyserNode.fftSize; // Frequency in Hz
                    });

                    // Update chart data
                    chart.data.labels = frequencyLabels;
                    chart.data.datasets[0].data = frequencyData;
                    chart.update();

                    requestAnimationFrame(updateChart);
                }
            };

            updateChart();
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [analyserNode]);

    return <canvas ref={chartRef} width="400" height="200"></canvas>;
};

export default FrequencyMagnitudeVisualization;