/**
 * Sanitizes a string for safe usage in MongoDB $regex queries to prevent ReDoS attacks.
 * @param {string} text - User input string.
 * @returns {string} - Escaped regex string.
 */
function escapeRegex(text) {
  if (typeof text !== "string") return "";
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
  escapeRegex,
};

