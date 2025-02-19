// const socketHandler = (io) => {
//   const meetings = {}; // Store meeting participants

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("join-meeting", ({ meetingId, name }) => {
//       socket.join(meetingId);

//       if (!meetings[meetingId]) {
//         meetings[meetingId] = {};
//       }

//       meetings[meetingId][socket.id] = name;
//       console.log(`${name} joined meeting: ${meetingId}`);

//       // Notify existing users about the new user
//       socket.to(meetingId).emit("user-joined", socket.id);
//     });

//     socket.on("offer", ({ offer, to }) => {
//       console.log(`Forwarding offer to ${to}`);
//       io.to(to).emit("offer", { offer, from: socket.id });
//     });

//     socket.on("answer", ({ answer, to }) => {
//       console.log(`Forwarding answer to ${to}`);
//       io.to(to).emit("answer", { answer, from: socket.id });
//     });

//     socket.on("ice-candidate", ({ candidate, to }) => {
//       console.log(`Forwarding ICE candidate to ${to}`);
//       io.to(to).emit("ice-candidate", { candidate, from: socket.id });
//     });

//     // 🎤 Handle Mute/Unmute
//     socket.on("toggle-audio", ({ meetingId, isAudioEnabled }) => {
//       console.log(`User ${socket.id} toggled audio: ${isAudioEnabled}`);
//       socket.to(meetingId).emit("toggle-audio", { from: socket.id, isAudioEnabled });
//     });

//     // 📷 Handle Video Toggle
//     socket.on("toggle-video", ({ meetingId, isVideoEnabled }) => {
//       console.log(`User ${socket.id} toggled video: ${isVideoEnabled}`);
//       socket.to(meetingId).emit("toggle-video", { from: socket.id, isVideoEnabled });
//     });

//     // 🖥️ Handle Screen Sharing
//     socket.on("toggle-screen", ({ meetingId, isScreenSharing }) => {
//       console.log(`User ${socket.id} toggled screen sharing: ${isScreenSharing}`);
//       socket.to(meetingId).emit("toggle-screen", { from: socket.id, isScreenSharing });
//     });

//     // ❌ Handle Meeting End
//     socket.on("end-meeting", ({ meetingId }) => {
//       console.log(`Meeting ${meetingId} ended`);
//       io.to(meetingId).emit("end-meeting");
//       delete meetings[meetingId];
//     });

//     // 🛑 Handle Disconnection
//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//       for (const meetingId in meetings) {
//         if (meetings[meetingId][socket.id]) {
//           delete meetings[meetingId][socket.id];
//           io.to(meetingId).emit("user-left", socket.id);
//         }
//       }
//     });
//   });
// };

// export default socketHandler;


// const socketHandler = (io) => {
//   const meetings = {}; // Store meeting participants

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     // 🎉 User joins the meeting
//     socket.on("join-meeting", ({ meetingId, name }) => {
//       socket.join(meetingId);

//       if (!meetings[meetingId]) {
//         meetings[meetingId] = {};
//       }

//       // ✅ Store participant details
//       meetings[meetingId][socket.id] = {
//         name,
//         isVideoEnabled: true, // Default video ON
//         isAudioEnabled: true, // Default audio ON
//       };
 
//       console.log(`${name} joined meeting: ${meetingId}`);

//       // ✅ Broadcast updated participant list
//       io.to(meetingId).emit("update-participants", meetings[meetingId]);

//       // ✅ Notify existing users about the new user
//       socket.to(meetingId).emit("user-joined", socket.id);
//     });

//     // 🎤 Handle Mute/Unmute
//     socket.on("toggle-audio", ({ meetingId, isAudioEnabled }) => {
//       if (meetings[meetingId]?.[socket.id]) {
//         meetings[meetingId][socket.id].isAudioEnabled = isAudioEnabled;
//       }
//       io.to(meetingId).emit("update-participants", meetings[meetingId]);
//     });

//     // 📷 Handle Video Toggle
//     socket.on("toggle-video", ({ meetingId, isVideoEnabled }) => {
//       if (meetings[meetingId]?.[socket.id]) {
//         meetings[meetingId][socket.id].isVideoEnabled = isVideoEnabled;
//       }
//       io.to(meetingId).emit("update-participants", meetings[meetingId]);
//     });

//     // 🖥️ Handle Screen Sharing
//     socket.on("toggle-screen", ({ meetingId, isScreenSharing }) => {
//       console.log(`User ${socket.id} toggled screen sharing: ${isScreenSharing}`);
//       socket.to(meetingId).emit("toggle-screen", { from: socket.id, isScreenSharing });
//     });

//     // 🔄 Forward WebRTC Signaling Messages
//     socket.on("offer", ({ offer, to }) => {
//       console.log(`Forwarding offer to ${to}`);
//       io.to(to).emit("offer", { offer, from: socket.id });
//     });

//     socket.on("answer", ({ answer, to }) => {
//       console.log(`Forwarding answer to ${to}`);
//       io.to(to).emit("answer", { answer, from: socket.id });
//     });

//     socket.on("ice-candidate", ({ candidate, to }) => {
//       console.log(`Forwarding ICE candidate to ${to}`);
//       io.to(to).emit("ice-candidate", { candidate, from: socket.id });
//     });

//     // ❌ Handle Meeting End
//     socket.on("end-meeting", ({ meetingId }) => {
//       console.log(`Meeting ${meetingId} ended`);
//       io.to(meetingId).emit("end-meeting");
//       delete meetings[meetingId];
//     });

//     // 🛑 Handle Disconnection
//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//       for (const meetingId in meetings) {
//         if (meetings[meetingId][socket.id]) {
//           delete meetings[meetingId][socket.id];
//           io.to(meetingId).emit("update-participants", meetings[meetingId]);
//           io.to(meetingId).emit("user-left", socket.id);
//         }
//       }
//     });
//   });
// };

// export default socketHandler;
