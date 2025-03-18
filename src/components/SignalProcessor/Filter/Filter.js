// import React, { useState, useRef, useEffect } from 'react';
// import LowPassFilter from './LowPassFilter';
// import './Filter.css';

// const Filter = () => {
//     const [frequency, setFrequency] = useState(1000); // Cutoff frequency
//     const [Q, setQ] = useState(1); // Q factor

//     const audioContextRef = useRef(null);
//     const sourceRef = useRef(null);

//     useEffect(() => {
//         // Initialize audio context and source
//         audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//         sourceRef.current = audioContextRef.current.createOscillator();
//         sourceRef.current.type = 'sawtooth';
//         sourceRef.current.frequency.value = 440; // A4 note
//         sourceRef.current.start();

//         // Connect the source to the destination (for testing)
//         sourceRef.current.connect(audioContextRef.current.destination);

//         // Cleanup
//         return () => {
//             sourceRef.current.stop();
//             audioContextRef.current.close();
//         };
//     }, []);

//     return (
//         <div className="filter-container">
//             <h2>Low-Pass Filter</h2>
//             <div className="filter-controls">
//                 <label>
//                     Cutoff Frequency:
//                     <input
//                         type="range"
//                         min="20"
//                         max="20000"
//                         value={frequency}
//                         onChange={(e) => setFrequency(parseFloat(e.target.value))}
//                     />
//                     {frequency} Hz
//                 </label>
//                 <label>
//                     Q Factor:
//                     <input
//                         type="range"
//                         min="0.1"
//                         max="10"
//                         step="0.1"
//                         value={Q}
//                         onChange={(e) => setQ(parseFloat(e.target.value))}
//                     />
//                     {Q}
//                 </label>
//             </div>
//             <LowPassFilter
//                 frequency={frequency}
//                 Q={Q}
//                 inputNode={sourceRef.current}
//                 outputNode={audioContextRef.current.destination}
//             />
//         </div>
//     );
// };

// export default Filter;