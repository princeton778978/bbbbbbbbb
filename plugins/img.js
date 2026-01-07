const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "img",
  alias: ["image", "pic", "photo", "gimage"],
  react: "📸",
  category: "media",
  desc: "Search and send 5 random images from Google",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(
        "*📸 IMAGE SEARCH COMMAND*\n\n" +
        "Is tarah use karo:\n" +
        "*.img <search term>*\n\n" +
        "Example:\n" +
        "*.img cute cats*"
      );
    }

    // 🔗 API call
    const API_URL = `https:///movanest.xyz/v2/googleimage?query=${encodeURIComponent(q)}`;
    const res = await axios.get(API_URL, { timeout: 60000 });

    if (!res.data || !res.data.status || !res.data.results || res.data.results.length === 0) {
      return reply("❌ Koi image nahi mili");
    }

    // ✅ Remove duplicates & shuffle
    const uniqueImages = [...new Set(res.data.results)];
    const shuffled = uniqueImages.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5); // first 5 random images

    // ✅ Send images one by one
    for (let i = 0; i < selected.length; i++) {
      try {
        await conn.sendMessage(from, {
          image: { url: selected[i] },
          caption: `*📸 Image Result for:* ${q} (${i+1}/${selected.length})`
        }, { quoted: mek });

        await new Promise(r => setTimeout(r, 700)); // small delay for smooth sending
      } catch (err) {
        console.log("IMAGE SEND ERROR:", err.message);
      }
    }

  } catch (err) {
    console.error("IMAGE COMMAND ERROR:", err.message);
    reply("❌ Image search failed / API busy");
  }
});
