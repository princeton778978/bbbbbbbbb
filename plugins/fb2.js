const { cmd } = require('../inconnuboy'); // Path check kar lein apne bot ke mutabiq
const axios = require('axios');

cmd({
  pattern: "fb2",
  alias: ["facebook", "fbdl"],
  react: "🔵",
  desc: "Download Facebook videos in mini bot style",
  category: "download",
  use: ".fb <link>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    // Basic URL Check
    if (!q || !q.startsWith("http")) {
      return reply("*👑 ENTER FACEBOOK VIDEO LINK G!*");
    }

    // Start Reaction
    await m.react("📥");

    // Calling API (Using Movanest as per your previous success)
    const apiUrl = `https://www.movanest.xyz/v2/fbdl?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // Validation Check
    if (!data || !data.status || !data.results || data.results.length === 0) {
      await m.react("❌");
      return reply("*👑 ERROR :❯* VIDEO NOT FOUND! 😔");
    }

    const video = data.results[0];
    const dlUrl = video.hdQualityLink || video.normalQualityLink;

    // Mini Bot Style Caption (Exactly like your APK/Song style)
    const caption = `
*👑 FB DOWNLOADER 👑*

*👑 NAME   :❯ ${video.title ? video.title.toUpperCase().slice(0, 30) : "FB VIDEO"}*
*👑 DUR    :❯ ${video.duration ? video.duration.toUpperCase() : "N/A"}*
*👑 QUALITY:❯ ${video.hdQualityLink ? 'HD' : 'NORMAL'}*

*👑 BILAL-MD 👑*`;

    // 1. Send Image First (Thumbnail)
    await conn.sendMessage(from, { 
      image: { url: video.thumbnail }, 
      caption: caption 
    }, { quoted: mek });

    // 2. Send Video File
    await conn.sendMessage(from, {
      video: { url: dlUrl },
      mimetype: "video/mp4",
      fileName: `fb_video.mp4`
    }, { quoted: mek });

    // Success Reaction
    await m.react("✅");

  } catch (err) {
    console.error("FB CMD ERROR:", err);
    await m.react("❌");
    reply("*👑 ERROR :❯* API SE RABTA NAHI HO PA RHA!");
  }
});
      
