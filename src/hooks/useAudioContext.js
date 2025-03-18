import { useState, useEffect } from 'react';

const useAudioContext = () => {
    const [audioContext, setAudioContext] = useState(null);

    useEffect(() => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
        return () => context.close();
    }, []);

    return audioContext;
};

export default useAudioContext;