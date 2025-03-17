import { useRef } from 'react';
import html2canvas from 'html2canvas';

const useRecordFunctions = () => {
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startRecording = async () => {
    try {
      // Create a canvas element to capture the div
      const canvas = document.createElement('canvas');
      canvas.width = 500; // Match the div width
      canvas.height = 500; // Match the div height
      const ctx = canvas.getContext('2d');
      canvasRef.current = canvas;

      // Create a MediaStream from the canvas
      const canvasStream = canvas.captureStream(30); // 30 FPS

      // Create a MediaRecorder instance
      mediaRecorderRef.current = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm',
      });

      // Handle data availability
      const recordedChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      // Save the recording when stopped
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Automatically save the file
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm'; // File name for the downloaded video
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
      };

      // Start recording
      mediaRecorderRef.current.start();

      // Continuously capture the div and draw it onto the canvas
      const captureFrame = () => {
        const divElement = document.getElementById('recordableDiv');
        if (divElement) {
          html2canvas(divElement).then((canvas) => {
            ctx.drawImage(canvas, 0, 0, 500, 500); // Draw the div onto the canvas
          });
        }
        animationFrameRef.current = requestAnimationFrame(captureFrame);
      };

      // Start capturing frames
      captureFrame();
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      // Stop capturing frames
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const startTimer = (setTimer) => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  return {
    startRecording,
    stopRecording,
    startTimer,
    stopTimer,
  };
};

export default useRecordFunctions;