const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "song",
  react: "😇",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("*AP NE KOI AUDIO DOWNLOADING KARNI HAI 🤔*\n*TO ESE LIKHO ☺️*\n\n*SONG ❮AUDIO NAME❯*\n\n*JAB AP ESE LIKHO GE 😊 TO APKA AUDIO DOWNLOADING KAR KE 😃 YAHA PER BHEJ DEYA JAYE GA 😍🌹*");

    let ytUrl = q;

    // 🔍 Agar link nahi hai → search karo
    if (!q.startsWith("http")) {
      const searchApi = `https://www.movanest.xyz/v2/ytsearch?query=${encodeURIComponent(q)}`;
      const searchRes = await axios.get(searchApi);
      const searchData = searchRes.data;

      if (!searchData.status || !searchData.results || searchData.results.length === 0) {
        return reply("*AUDIO NAHI MIL RAHA 🥺*");
      }

      ytUrl = searchData.results[0].url; // first result
    }

    // 🎵 MP3 API
    const apiUrl = `https://www.movanest.xyz/v2/ytmp3?url=${encodeURIComponent(ytUrl)}`;
    const { data } = await axios.get(apiUrl);

    if (data.status !== true || !data.results) {
      return reply("*AUDIO NAHI MIL RAHA 🥺*");
    }

    const meta = data.results.metadata;
    const dl = data.results.download;

    if (!dl?.url) return reply("*SIRF YOUTUBE VIDEO LINK DO 🤗*");

    // ℹ️ Simple info
    await reply(
      `*👑 AUDIO INFO 👑*\n\n` +
      `*👑 AUDIO NAME 👑* \n${meta.title}\n\n` +
      `*👑 TIKTOK ID 👑* \n ${meta.author.name}\n\n` +
      `*👑 TIME 👑* \n ${meta.duration.timestamp}\n\n*👑 BY :❯ BILAL-MD 👑*`
    );

    // 🔊 Direct audio
    await conn.sendMessage(
      from,
      {
        audio: { url: dl.url },
        mimetype: "audio/mpeg"
      },
      { quoted: mek }
    );

  } catch (err) {
    console.log("SONG CMD ERROR:", err);
    reply("❌ Error aa gaya");
  }
});
