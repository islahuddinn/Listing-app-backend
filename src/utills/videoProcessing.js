const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs"); 
const { SpeechClient } = require("@google-cloud/speech");
const speechClient = new SpeechClient();


function saveVideoFrames(videoPath) {
  return new Promise((resolve, reject) => {
    const thumbnailPath = videoPath.replace(".mp4", "_thumbnail.jpg");
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ["50%"], // Middle frame
        filename: thumbnailPath,
        folder: "./uploads/",
      })
      .on("end", () => resolve(thumbnailPath))
      .on("error", (err) => reject(err));
  });
}
  async function transcribeAudio(videoPath) {
    try {
      const audioBytes = fs.readFileSync(videoPath).toString("base64"); // Convert video file to base64

      const [response] = await speechClient.recognize({
        audio: { content: audioBytes },
        config: {
          encoding: "LINEAR16", // Update as per the video encoding
          sampleRateHertz: 16000,
          languageCode: "en-US",
        },
      });

      return response.results
        .map((result) => result.alternatives[0].transcript)
        .join(" "); // Combine all transcriptions
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Transcription failed");
    }
  }
module.exports = { saveVideoFrames , transcribeAudio  };
