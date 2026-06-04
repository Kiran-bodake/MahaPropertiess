import { Server } from "socket.io";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

let io: Server | undefined;

export async function GET(req: any) {
  if (!io) {
    const res = NextResponse.next();

    // @ts-ignore
    if (!res.socket?.server?.io) {
      // @ts-ignore
      const httpServer = res.socket.server;

      io = new Server(httpServer, {
        path: "/api/socket",
        cors: {
          origin: "*",
        },
      });

      io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.id);

        socket.on("join", (userId) => {
          socket.join(userId);
        });
      });

      // @ts-ignore
      res.socket.server.io = io;
      global.io = io;
    }
  }

  return NextResponse.json({ success: true });
}