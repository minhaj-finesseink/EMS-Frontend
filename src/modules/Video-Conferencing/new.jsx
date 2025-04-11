// /* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";
// import socket from "./socket";
// import './newStyle.css';

// const CaptionProvider = ({ meetingId, captionEnabled }) => {
//   const [captions, setCaptions] = useState([]);
//   const audioContextRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const workletNodeRef = useRef(null);

//   const convertFloat32ToInt16 = (buffer) => {
//     const len = buffer.length;
//     const int16Buffer = new Int16Array(len);
//     for (let i = 0; i < len; i++) {
//       int16Buffer[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
//     }
//     return int16Buffer.buffer;
//   };

//   useEffect(() => {
//     if (captionEnabled) {
//       const initAudio = async () => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaStreamRef.current = stream;

//           const audioContext = new (window.AudioContext || window.webkitAudioContext)({
//             sampleRate: 48000
//           });
//           audioContextRef.current = audioContext;

//           await audioContext.audioWorklet.addModule(URL.createObjectURL(new Blob([`
//             class PCMProcessor extends AudioWorkletProcessor {
//               process(inputs) {
//                 const input = inputs[0];
//                 if (input.length > 0) {
//                   this.port.postMessage(input[0]);
//                 }
//                 return true;
//               }
//             }
//             registerProcessor('pcm-processor', PCMProcessor);
//           `], { type: "application/javascript" })));

//           const source = audioContext.createMediaStreamSource(stream);
//           const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
//           workletNode.port.onmessage = (e) => {
//             const float32 = e.data;
//             const int16 = convertFloat32ToInt16(float32);
//             socket.emit("audio-data", int16);
//           };

//           source.connect(workletNode).connect(audioContext.destination);
//           workletNodeRef.current = workletNode;
//         } catch (error) {
//           console.error("Error accessing mic for captioning:", error);
//         }
//       };

//       initAudio();
//     } else {
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//         audioContextRef.current = null;
//       }
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach(track => track.stop());
//         mediaStreamRef.current = null;
//       }
//       workletNodeRef.current = null;
//     }

//     return () => {
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//         audioContextRef.current = null;
//       }
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach(track => track.stop());
//         mediaStreamRef.current = null;
//       }
//       workletNodeRef.current = null;
//     };
//   }, [captionEnabled]);

//   const punctuate = (text) => {
//     const trimmed = text.trim();
//     if (!trimmed) return "";
//     const lastChar = trimmed.slice(-1);
//     if ([".", "!", "?"].includes(lastChar)) return trimmed;
//     if (trimmed.split(" ").length < 5) return trimmed + ",";
//     return trimmed + ".";
//   };

//   useEffect(() => {
//     socket.on("transcription", ({ speaker, transcription, isFinal }) => {
//       const text = punctuate(transcription);
//       const label = speaker?.toLowerCase() === "minhaj" ? "You" : speaker;

//       setCaptions((prev) => {
//         const last = prev[prev.length - 1];

//         // 🧠 If same speaker, group the text
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
//     });

//     return () => {
//       socket.off("transcription");
//     };
//   }, []);

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

const CaptionProvider = ({ meetingId, captionEnabled }) => {
  const [captions, setCaptions] = useState([]);
  const [socketId, setSocketId] = useState(null);

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const workletNodeRef = useRef(null);

  // 🔄 Convert Float32 to Int16 PCM
  const convertFloat32ToInt16 = (buffer) => {
    const len = buffer.length;
    const int16Buffer = new Int16Array(len);
    for (let i = 0; i < len; i++) {
      int16Buffer[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
    }
    return int16Buffer.buffer;
  };

  // 🎙️ Handle audio stream when captionEnabled changes
  useEffect(() => {
    if (captionEnabled) {
      setCaptions([]); // 🔁 Clear previous captions when enabling again

      const initAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaStreamRef.current = stream;

          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)({
            sampleRate: 48000,
          });
          audioContextRef.current = audioContext;

          await audioContext.audioWorklet.addModule(
            URL.createObjectURL(
              new Blob(
                [
                  `
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
          `,
                ],
                { type: "application/javascript" }
              )
            )
          );

          const source = audioContext.createMediaStreamSource(stream);
          const workletNode = new AudioWorkletNode(
            audioContext,
            "pcm-processor"
          );
          workletNode.port.onmessage = (e) => {
            const float32 = e.data;
            const int16 = convertFloat32ToInt16(float32);
            socket.emit("audio-data", int16);
          };

          source.connect(workletNode).connect(audioContext.destination);
          workletNodeRef.current = workletNode;
        } catch (error) {
          console.error("Error accessing mic for captioning:", error);
        }
      };

      initAudio();
    } else {
      // 🔁 Stop and clear everything when disabled
      setCaptions([]);

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      workletNodeRef.current = null;
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      workletNodeRef.current = null;
    };
  }, [captionEnabled]);

  // 🧠 Add punctuation
  const punctuate = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const lastChar = trimmed.slice(-1);
    if ([".", "!", "?"].includes(lastChar)) return trimmed;
    if (trimmed.split(" ").length < 5) return trimmed + ",";
    return trimmed + ".";
  };

  // 📥 Listen to transcription
  useEffect(() => {
    const handleTranscription = ({
      socketId,
      speaker,
      transcription,
      isFinal,
    }) => {
      console.log("socketId", socketId);
      const text = punctuate(transcription);
      const label = socketId === socketId ? "You" : speaker;

      setCaptions((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.speaker === label) {
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              text: last.text + " " + text,
              isFinal: isFinal || last.isFinal,
            },
          ];
        } else {
          return [...prev, { speaker: label, text, isFinal }];
        }
      });
    };

    socket.on("transcription", handleTranscription);
    return () => {
      socket.off("transcription", handleTranscription);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("My socket ID:", socket.id);
      setSocketId(socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

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
