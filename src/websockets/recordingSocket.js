const WebSocket = require("ws");
const { detectKeywords } = require("../utils/keywordDetection");

const setupRecordingSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    ws.on("message", async (data) => {
      const { audioChunk, sessionId } = JSON.parse(data);

      if (!audioChunk) {
        return ws.send(JSON.stringify({ error: "Invalid audio data" }));
      }

      const detectedKeywords = await detectKeywords(audioChunk);

      ws.send(JSON.stringify({ sessionId, detectedKeywords }));
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
};

module.exports = setupRecordingSocket;
