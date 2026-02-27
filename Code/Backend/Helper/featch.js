const fetch = require("node-fetch");

module.exports.translateText = async (text, targetLanguages) => {
  const apiKey = "8GCCVRH-2714BMS-QR363X5-CGBP337";
  const apiUrl = "https://api.lecto.ai/v1/translate/text";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      texts: [text], // ✅ Lecto API yêu cầu mảng `texts`
      to: targetLanguages, // ví dụ ["vi"]
      from: "en",
    }),
  });

  const raw = await response.text(); // đọc raw text để debug
  console.log("Lecto response:", raw);

  if (!response.ok) {
    throw new Error(`Lecto API error: ${response.status} ${raw}`);
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON response: ${err.message}\nRaw: ${raw}`);
  }
};
