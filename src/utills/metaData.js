async function extractMVL({ transcription, price, condition, description }) {
  const requiredFields = ["price", "condition", "description"];
  const missingFields = [];

  if (!price) missingFields.push("price");
  if (!condition) missingFields.push("condition");
  if (!description && !transcription.includes("description"))
    missingFields.push("description");

  return {
    isValidMVL: missingFields.length === 0,
    missingFields,
  };
}

async function enrichMetadata({ transcription, videoPath }) {
  // Step 1: Extract still frames from video for thumbnails
  const thumbnail = await saveVideoFrames(videoPath);

  // Step 2: Extract tags from audio and transcription
  const audioTags = extractTagsFromTranscription(transcription);

  // Step 3: Enrich description based on speech-to-text
  const enrichedDescription = transcription;

  return {
    speechToText: transcription,
    audioTags,
    thumbnail,
    enrichedDescription,
  };
}

function extractTagsFromTranscription(transcription) {
  const keywords = ["new", "used", "price", "condition"];
  return keywords.filter((keyword) => transcription.includes(keyword));
}

module.exports = { extractMVL, enrichMetadata };
