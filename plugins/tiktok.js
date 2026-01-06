const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "tiktok",
  react: "🎵",
  alias: ["tiktok", "ttdl", "tt", "tiktokvideo", "ttvideo"],
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ TikTok video link do");

    const apiUrl = `https://www.movanest.xyz/v2/tiktok?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // 🔎 API status check
    if (data.status !== true || !data.results) {
      return reply("❌ Video fetch nahi hui");
    }

    const res = data.results;

    if (!res.no_watermark) {
      return reply("❌ No-watermark video nahi mili");
    }

    // 🔹 Simple info (optional but clean)
    await reply(
      `🎵 *TikTok Video*\n\n` +
      `📌 ${res.title || "No title"}`
    );

    // 🔹 Send no-watermark video
    await conn.sendMessage(
      from,
      {
        video: { url: res.no_watermark },
        mimetype: "video/mp4"
      },
      { quoted: mek }
    );

  } catch (err) {
    console.log("TIKTOK CMD ERROR:", err);
    reply("❌ Error aa gaya");
  }
});
