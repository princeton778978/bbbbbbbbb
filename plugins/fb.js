const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  react: "🔵",
  desc: "Download Facebook Videos",
  category: "download",
  use: ".fb <url>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*👑 ENTER FACEBOOK VIDEO LINK G!*");

    // Start Reaction
    await m.react("📥");

    // Replace this with your actual API endpoint
    const apiUrl = `YOUR_API_URL_HERE?url=${encodeURIComponent(q)}`; 
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.results.length) {
      return reply("*👑 ERROR :❯* VIDEO NOT FOUND OR PRIVATE! 😔");
    }

    const video = data.results[0];
    const dlUrl = video.hdQualityLink || video.normalQualityLink; // HD ko pehle check karega

    // Design Caption (Same as your Uptime/Song style)
    let caption = `╭━━━〔 *FB DOWNLOADER* 〕━━━┈⊷
┃
┃ 👑 *TITLE:* ${video.title.toUpperCase()}
┃ 👑 *DUR:* ${video.duration.toUpperCase()}
┃ 👑 *QUALITY:* ${video.hdQualityLink ? 'HD' : 'NORMAL'}
┃
╰━━━━━━━━━━━━━━━┈⊷

*POWERED BY BILAL-MD* 👑`;

    // 1. Send Thumbnail with Caption
    await conn.sendMessage(from, { 
      image: { url: video.thumbnail }, 
      caption: caption 
    }, { quoted: mek });

    // 2. Send Video File
    await conn.sendMessage(from, {
      video: { url: dlUrl },
      caption: "*👑 BY :❯ BILAL-MD 👑*",
      mimetype: "video/mp4",
      fileName: `fb_video.mp4`
    }, { quoted: mek });

    await m.react("✅");

  } catch (err) {
    console.error("FB CMD ERROR:", err);
    reply("*👑 ERROR :❯* API SE RABTA NAHI HO PA RHA!");
    await m.react("❌");
  }
});
      
