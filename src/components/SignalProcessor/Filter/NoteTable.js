import React from 'react';

const noteFrequencyTable = [
    { note: 'C4', frequency: 261.63 },
    { note: 'D4', frequency: 293.66 },
    { note: 'E4', frequency: 329.63 },
    { note: 'F4', frequency: 349.23 },
    { note: 'G4', frequency: 392.00 },
    { note: 'A4', frequency: 440.00 },
    { note: 'B4', frequency: 493.88 },
    { note: 'C5', frequency: 523.25 },
];

const NoteTable = ({ onNoteSelect }) => {
    return (
        <table className="note-table">
            <thead>
                <tr>
                    <th>Note</th>
                    <th>Frequency (Hz)</th>
                </tr>
            </thead>
            <tbody>
                {noteFrequencyTable.map(({ note, frequency }) => (
                    <tr key={note} onClick={() => onNoteSelect(frequency)}>
                        <td>{note}</td>
                        <td>{frequency}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NoteTable;