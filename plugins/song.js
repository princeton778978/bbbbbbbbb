const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "song",
  alias: ["play", "mp3", "ytmp3"],
  react: "🎶",
  desc: "Download YouTube Audio via Updated API",
  category: "download",
  use: ".song <url>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*👑 ENTER YOUTUBE LINK G!*");

    // Start Reaction
    await m.react("📥");

    // Calling API
    const apiUrl = `https://www.movanest.xyz/v2/ytmp3?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // Check if download URL exists in results.download.url
    if (!data || !data.results || !data.results.download || !data.results.download.url) {
      await m.react("❌");
      return reply("*👑 ERROR :❯* AUDIO NOT FOUND OR API DOWN! 😔");
    }

    const metadata = data.results.metadata;
    const download = data.results.download;

    // Design Caption (Mini Bot Style with Fancy Borders)
    let caption = `╭━━━〔 *SONG DOWNLOADER* 〕━━━┈⊷
┃
┃ 👑 *TITLE:* ${metadata.title.toUpperCase()}
┃ 👑 *VIEWS:* ${metadata.views}
┃ 👑 *TIME:* ${metadata.duration.timestamp}
┃ 👑 *SIZE:* ${(download.size / 1024 / 1024).toFixed(2)} MB
┃
╰━━━━━━━━━━━━━━━┈⊷

*POWERED BY BILAL-MD* 👑`;

    // 1. Send Thumbnail with Caption
    await conn.sendMessage(from, { 
      image: { url: metadata.thumbnail || metadata.image }, 
      caption: caption 
    }, { quoted: mek });

    // 2. Send Audio File
    await conn.sendMessage(from, {
      audio: { url: download.url },
      mimetype: "audio/mpeg",
      fileName: `${metadata.title.toUpperCase()}.mp3`
    }, { quoted: mek });

    await m.react("✅");

  } catch (err) {
    console.error("SONG CMD ERROR:", err);
    await m.react("❌");
    reply("*👑 ERROR :❯* SERVER SE RABTA NAHI HO PA RHA!");
  }
});
