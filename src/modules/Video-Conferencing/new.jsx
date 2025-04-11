// /* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";
// import socket from "./socket";
// import "./newStyle.css";

// const CaptionProvider = ({ meetingId, captionEnabled, audioEnabled }) => {
//   const [captions, setCaptions] = useState([]);
//   const audioContextRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const workletNodeRef = useRef(null);

//   // 🔄 Convert Float32 to Int16 PCM
//   const convertFloat32ToInt16 = (buffer) => {
//     const len = buffer.length;
//     const int16Buffer = new Int16Array(len);
//     for (let i = 0; i < len; i++) {
//       int16Buffer[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
//     }
//     return int16Buffer.buffer;
//   };

//   // 🎙️ Handle audio stream when captionEnabled changes
//   useEffect(() => {
//     const stopAudioStream = () => {
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//         audioContextRef.current = null;
//       }
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//         mediaStreamRef.current = null;
//       }
//       workletNodeRef.current = null;
//     };

//     if (captionEnabled) {
//       // ❌ Do NOT clear captions when just toggling audio
//       // ✅ Only clear on fresh captionEnabled true
//       if (!audioContextRef.current && audioEnabled) {
//         const initAudio = async () => {
//           try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//               audio: true,
//             });
//             mediaStreamRef.current = stream;

//             const audioContext = new (window.AudioContext ||
//               window.webkitAudioContext)({
//               sampleRate: 48000,
//             });
//             audioContextRef.current = audioContext;

//             await audioContext.audioWorklet.addModule(
//               URL.createObjectURL(
//                 new Blob(
//                   [
//                     `
//                   class PCMProcessor extends AudioWorkletProcessor {
//                     process(inputs) {
//                       const input = inputs[0];
//                       if (input.length > 0) {
//                         this.port.postMessage(input[0]);
//                       }
//                       return true;
//                     }
//                   }
//                   registerProcessor('pcm-processor', PCMProcessor);
//                 `,
//                   ],
//                   { type: "application/javascript" }
//                 )
//               )
//             );

//             const source = audioContext.createMediaStreamSource(stream);
//             const workletNode = new AudioWorkletNode(
//               audioContext,
//               "pcm-processor"
//             );

//             workletNode.port.onmessage = (e) => {
//               const float32 = e.data;
//               const hasSound = float32.some(
//                 (sample) => Math.abs(sample) > 0.001
//               );

//               if (hasSound) {
//                 const int16 = convertFloat32ToInt16(float32);
//                 socket.emit("audio-data", int16);
//               } else {
//                 const silentBuffer = new Int16Array(480);
//                 socket.emit("audio-data", silentBuffer.buffer);
//               }
//             };

//             source.connect(workletNode).connect(audioContext.destination);
//             workletNodeRef.current = workletNode;
//           } catch (error) {
//             console.error("Error accessing mic for captioning:", error);
//           }
//         };

//         initAudio();
//       }

//       // 🧠 If audioEnabled becomes false, stop mic stream but keep captions & listeners
//       if (!audioEnabled) {
//         stopAudioStream(); // ❌ Only stop mic, keep captions visible
//       }
//     } else {
//       // 🔴 Captions disabled => stop everything and clear UI
//       stopAudioStream();
//       setCaptions([]);
//     }

//     return () => {
//       stopAudioStream();
//     };
//   }, [captionEnabled, audioEnabled]);

//   // 🧠 Add punctuation
//   const punctuate = (text) => {
//     const trimmed = text.trim();
//     if (!trimmed) return "";
//     const lastChar = trimmed.slice(-1);
//     if ([".", "!", "?"].includes(lastChar)) return trimmed;
//     if (trimmed.split(" ").length < 5) return trimmed + ",";
//     return trimmed + ".";
//   };

//   // 📥 Listen to transcription
//   useEffect(() => {
//     const handleTranscription = ({ speaker, transcription, isFinal }) => {
//       const text = punctuate(transcription);
//       const label = speaker;

//       setCaptions((prev) => {
//         const last = prev[prev.length - 1];
//         if (last && last.speaker === label) {
//           return [
//             ...prev.slice(0, -1),
//             {
//               ...last,
//               text: last.text + " " + text,
//               isFinal: isFinal || last.isFinal,
//             },
//           ];
//         } else {
//           return [...prev, { speaker: label, text, isFinal }];
//         }
//       });
//     };

//     socket.on("transcription", handleTranscription);
//     return () => {
//       socket.off("transcription", handleTranscription);
//     };
//   }, []);

//   useEffect(() => {
//     if (captionEnabled) {
//       socket.emit("caption-status", { meetingId, isEnabled: true });
//     } else {
//       socket.emit("caption-status", { meetingId, isEnabled: false });
//     }

//     return () => {
//       socket.emit("caption-status", { meetingId, isEnabled: false });
//     };
//   }, [captionEnabled, meetingId]);

//   if (!captionEnabled) return null;

//   return (
//     <div className="caption-box scrollable-captions">
//       {captions.map((c, i) => (
//         <div key={i} className={`caption ${c.isFinal ? "final" : "interim"}`}>
//           <strong>{c.speaker}:</strong> {c.text}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CaptionProvider;

/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import socket from "./socket";
import "./newStyle.css";

const CaptionProvider = ({ meetingId, captionEnabled, audioEnabled, localStream }) => {
  const [captions, setCaptions] = useState([]);
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const silentIntervalRef = useRef(null);

  const convertFloat32ToInt16 = (buffer) => {
    const int16Buffer = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      int16Buffer[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
    }
    return int16Buffer.buffer;
  };

  useEffect(() => {
    const stopAudioStream = () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      workletNodeRef.current = null;
      if (silentIntervalRef.current) {
        clearInterval(silentIntervalRef.current);
        silentIntervalRef.current = null;
      }
    };

    const initAudio = async () => {
      try {
        const stream = localStream.clone();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
        audioContextRef.current = audioContext;

        await audioContext.audioWorklet.addModule(
          URL.createObjectURL(new Blob([`
            class PCMProcessor extends AudioWorkletProcessor {
              process(inputs) {
                const input = inputs[0];
                if (input.length > 0) {
                  this.port.postMessage(input[0]);
                }
                return true;
              }
            }
            registerProcessor('pcm-processor', PCMProcessor);
          `], { type: "application/javascript" }))
        );

        const source = audioContext.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");
        workletNode.port.onmessage = (e) => {
          const float32 = e.data;
          const hasSound = float32.some((sample) => Math.abs(sample) > 0.001);
          const int16 = hasSound
            ? convertFloat32ToInt16(float32)
            : new Int16Array(480).buffer;
          socket.emit("audio-data", int16);
        };

        source.connect(workletNode).connect(audioContext.destination);
        workletNodeRef.current = workletNode;
      } catch (error) {
        console.error("Audio init error:", error);
      }
    };

    // Always send audio
    if (!audioContextRef.current && audioEnabled && localStream) {
      initAudio();
    }

    if (!audioEnabled && !silentIntervalRef.current) {
      silentIntervalRef.current = setInterval(() => {
        const silentBuffer = new Int16Array(480);
        socket.emit("audio-data", silentBuffer.buffer);
      }, 100);
    }

    return () => {
      stopAudioStream();
    };
  }, [audioEnabled, localStream]);

  const punctuate = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const lastChar = trimmed.slice(-1);
    if ([".", "!", "?"].includes(lastChar)) return trimmed;
    return trimmed + ".";
  };

  useEffect(() => {
    const handleTranscription = ({ speaker, transcription, isFinal }) => {
      const text = punctuate(transcription);
      setCaptions((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.speaker === speaker) {
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              text: last.text + " " + text,
              isFinal: isFinal || last.isFinal,
            },
          ];
        } else {
          return [...prev, { speaker, text, isFinal }];
        }
      });
    };

    socket.on("transcription", handleTranscription);
    return () => {
      socket.off("transcription", handleTranscription);
    };
  }, []);

  useEffect(() => {
    socket.emit("caption-status", { meetingId, isEnabled: captionEnabled });
    return () => {
      socket.emit("caption-status", { meetingId, isEnabled: false });
    };
  }, [captionEnabled, meetingId]);

  if (!captionEnabled) return null;

  return (
    <div className="caption-box scrollable-captions">
      {captions.map((c, i) => (
        <div key={i} className={`caption ${c.isFinal ? "final" : "interim"}`}>
          <strong>{c.speaker}:</strong> {c.text}
        </div>
      ))}
    </div>
  );
};

export default CaptionProvider;
