import React from 'react';

const RecordButton = ({ isRecording, timer, onStartStop }) => {
  return (
    <button onClick={onStartStop}>
      {isRecording ? `Stop Recording (${timer}s)` : 'Start Recording'}
    </button>
  );
};

export default RecordButton;