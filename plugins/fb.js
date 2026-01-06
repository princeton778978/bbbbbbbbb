const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "fb",
  react: "☺️",
  alias: ["facebook", "fbdl"],
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    // Agar link nahi diya to
    if (!q) return reply("G LINK DEIN!");

    // API Call
    const apiUrl = `https:///movanest.xyz/v2/fbdown?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // Check if video link exists
    if (!data || !data.results || data.results.length === 0) {
      return reply("VIDEO NAHI MILI!");
    }

    const dlUrl = data.results[0].hdQualityLink || data.results[0].normalQualityLink;

    // Direct Video Send (No extra text, no image)
    await conn.sendMessage(from, {
      video: { url: dlUrl },
      caption: "*BY BILAL-MD*",
      mimetype: "video/mp4"
    }, { quoted: mek });

  } catch (err) {
    // Sirf simple error message
    reply("ERROR AA GAYA!");
  }
});
