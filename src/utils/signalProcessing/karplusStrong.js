export const karplusStrong = (
  audioContext, 
  frequency, 
  duration, 
  useFractionalDelay = false, 
  useCircularBuffer = false,
  bufferSize = 1024, // Circular buffer length
  feedbackGain = 0.5, // Controls sustain
  damping = 0.99, // Decay rate
  pluckingStrength = 0.5, // Scaling of initial noise
  filterCutoff = 5000 // Low-pass filter cutoff
) => {
  const sampleRate = audioContext.sampleRate;
  bufferSize = Math.max(128, Math.round(bufferSize)); // Minimum 128

  const source = audioContext.createBufferSource();

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  // for visualization
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 4096;

  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterCutoff, audioContext.currentTime);

  if (useCircularBuffer) {
      // Custom circular buffer implementation
      const buffer = new Float32Array(bufferSize);
      const outputBuffer = audioContext.createBuffer(1, bufferSize, sampleRate); // Output buffer for visualization
      const outputData = outputBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
          buffer[i] = (Math.random() * 2 - 1) * pluckingStrength; // Scale initial noise
      }

      let readIndex = 0;
      let writeIndex = Math.floor(bufferSize / 2); // Start writing halfway through the buffer

      // Prevent runaway feedback
      const maxGain = 0.98;

      // ScriptProcessorNode to process audio in real-time
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (event) => {
          const input = event.inputBuffer.getChannelData(0);
          const output = event.outputBuffer.getChannelData(0);

          for (let i = 0; i < input.length; i++) {
              const sample = buffer[readIndex];

              // higher frequency = more damping
              const dynamicDamping = 1.0 - (1.0 - damping) * (frequency / 2000);

              // Adjusted gain to prevent infinite sustain
              const adjustedGain = Math.min(feedbackGain * damping * dynamicDamping, maxGain);

              const clip = (x) => Math.max(-1, Math.min(1, x));

              buffer[writeIndex] = clip((sample + buffer[writeIndex]) * adjustedGain);

              // Output the sample
              output[i] = sample;

              readIndex = (readIndex + 1) % bufferSize;
              writeIndex = (writeIndex + 1) % bufferSize;
          }
      };

      source.buffer = outputBuffer;
      source.loop = true;
      source.connect(processor);
      processor.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(analyser);
      analyser.connect(audioContext.destination);

      return {
          source,
          noiseBuffer: buffer, // Return the initial noise buffer for visualization
          analyser, // Return the analyser node for real-time visualization
      };
  } else {
      // Web Audio API's DelayNode implementation
      const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Fill the buffer with scaled random noise
      for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * pluckingStrength;
      }

      source.buffer = buffer;
      source.loop = true;

      // API: Create a delay node for fractional delay
      const delayNode = audioContext.createDelay();
      delayNode.delayTime.value = useFractionalDelay ? 1 / frequency : 0;

      source.connect(delayNode);
      delayNode.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(analyser);
      analyser.connect(audioContext.destination);

      return {
          source,
          noiseBuffer: data, //initial noise buffer
          analyser, // visualization
      };
  }
};
