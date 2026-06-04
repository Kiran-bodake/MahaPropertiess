const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });
});

console.log("🚀 Socket server running on http://localhost:4000");