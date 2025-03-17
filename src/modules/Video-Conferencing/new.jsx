// import React, { useState, useEffect } from 'react';
// import RecordButton from './button.jsx';
// import useRecordFunctions from './function.jsx';

// const RecordDiv = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const { startRecording, stopRecording, startTimer, stopTimer } = useRecordFunctions();

//   const handleStartStop = () => {
//     if (isRecording) {
//       stopRecording();
//       stopTimer();
//     } else {
//       startRecording();
//       startTimer(setTimer);
//     }
//     setIsRecording((prev) => !prev);
//   };

//   // Cleanup timer on unmount
//   useEffect(() => {
//     return () => {
//       stopTimer();
//     };
//   }, []);

//   return (
//     <div>
//       {/* Dummy div with orange background */}
//       <div
//         id="recordableDiv"
//         style={{
//           width: '500px',
//           height: '500px',
//           backgroundColor: 'orange',
//           border: '2px solid black',
//         }}
//       >
//         <h2>This is the area being recorded</h2>
//         <p>Record this div without a preview.</p>
//       </div>

//       {/* Start/Stop Recording Button */}
//       <RecordButton
//         isRecording={isRecording}
//         timer={timer}
//         onStartStop={handleStartStop}
//       />
//     </div>
//   );
// };

// export default RecordDiv;
import React, { useRef, useState } from 'react';

const ContentRecorder = () => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const ffmpeg = window.FFmpeg.createFFmpeg({ log: true }); // Use the global FFmpeg object

  const startRecording = async () => {
    try {
      // Capture audio
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Capture canvas video stream
      const canvas = canvasRef.current;
      const content = contentRef.current;
      canvas.width = content.clientWidth;
      canvas.height = content.clientHeight;
      const videoStream = canvas.captureStream(15); // 15 FPS

      // Combine audio and video streams
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      // Record the combined stream
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp8,vorbis',
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Convert to MP4 using ffmpeg.js
        if (!ffmpeg.isLoaded()) {
          await ffmpeg.load();
        }

        const inputName = 'input.webm';
        const outputName = 'output.mp4';

        ffmpeg.FS('writeFile', inputName, await window.FFmpeg.fetchFile(blob)); // Use global fetchFile
        await ffmpeg.run('-i', inputName, '-c:v', 'libx264', '-c:a', 'aac', outputName);
        const data = ffmpeg.FS('readFile', outputName);

        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.mp4';
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);

      // Start the timer
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      // Draw content onto canvas
      const draw = () => {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(content, 0, 0, canvas.width, canvas.height);
        if (recording) {
          requestAnimationFrame(draw);
        }
      };

      draw();
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      clearInterval(timerRef.current); // Stop the timer
    }
  };

  // Format the timer (HH:MM:SS)
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Content Recorder</h1>
      <div
        ref={contentRef}
        style={{
          width: '100%',
          height: '100vh', // Full height of the screen
          border: '2px solid black',
          backgroundColor: 'lightblue',
          position: 'relative',
        }}
      >
        <p>This is the content area to be recorded.</p>
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {recording && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: '5px',
              borderRadius: '5px',
            }}
          >
            Recording: {formatTime(timer)}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ContentRecorder;