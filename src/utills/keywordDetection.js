/**
 * Utility function to detect predefined keywords in text
 * @param {String} transcription - The text to search for keywords.
 * @param {Array} keywords - The list of keywords to detect (default: price, condition, new/used).
 * @returns {Object} - An object containing the detected keywords and their counts.
 */
function detectKeywords(
  transcription,
  keywords = ["price", "condition", "new", "used"]
) {
  if (!transcription || typeof transcription !== "string") {
    throw new Error(
      "Invalid transcription input. It must be a non-empty string."
    );
  }

  const detected = {};
  const lowerCaseText = transcription.toLowerCase();

  keywords.forEach((keyword) => {
    const occurrences = lowerCaseText.split(keyword.toLowerCase()).length - 1;
    if (occurrences > 0) {
      detected[keyword] = occurrences;
    }
  });

  return detected;
}

/**
 * Utility function to group detected keywords into buckets
 * @param {Object} detectedKeywords - The detected keywords object from `detectKeywords`.
 * @returns {Object} - Grouped buckets based on predefined categories.
 */
function groupKeywords(detectedKeywords) {
  const buckets = {
    pricing: [],
    condition: [],
    others: [],
  };

  Object.keys(detectedKeywords).forEach((keyword) => {
    if (["price"].includes(keyword)) {
      buckets.pricing.push(keyword);
    } else if (["new", "used", "condition"].includes(keyword)) {
      buckets.condition.push(keyword);
    } else {
      buckets.others.push(keyword);
    }
  });

  return buckets;
}

module.exports = {
  detectKeywords,
  groupKeywords,
};
