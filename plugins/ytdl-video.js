const { cmd } = require("../inconnuboy");
const axios = require("axios");
const ytSearch = require("yt-search");

cmd({
  pattern: "video",
  alias: ["ytmp4", "v", "ytvideo"],
  desc: "Download YouTube videos by name or keyword",
  category: "media",
  react: "☺️",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {
  if (!q) {
    return conn.sendMessage(from, { text: "*AP NE KOI YOUTUBE VIDEO DOWNLOAD KARNI HAI 🤔*\n*TO AP ESE LIKHO ☺️*\n\n*VIDEO ❮VIDEO KA NAME❯*\n\n*JAB AP ESE LIKHO GE 🤗 TO APKI VIDEO DOWNLOAD KAR KE 😃 YAHA PER BHEJ DE JAYE GE 😍🌹*" }, { quoted: mek });
  }

  try {
    // 🔍 Searching reaction
    await conn.sendMessage(from, { react: { text: "😃", key: mek.key } });

    // 🔎 Search YouTube
    const searchResult = await ytSearch(q);
    const video = searchResult.videos?.[0];
    if (!video) throw new Error("*YEH VIDEO NAHI MILI 😔*");

    // 🎯 Fetch download info
    const downloadInfo = await fetchVideoDownload(video);

    // 🌟 Send modern preview
    await sendStyledPreview(conn, from, mek, video, downloadInfo);

    // 🎬 Send actual video
    await sendStyledVideo(conn, from, mek, video, downloadInfo);

    // ✅ Success reaction
    await conn.sendMessage(from, { react: { text: "😍", key: mek.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "*VIDEO NAHI MIL RAHI 🥺*" }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
  }
});

// -------------------
// Helper: Fetch Video
// -------------------
async function fetchVideoDownload(video) {
  const apis = [
    `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`,
    `https://all-in-one-downloader-six.vercel.app/api/download?url=Api)}`
  ];

  for (let i = 0; i < apis.length; i++) {
    try {
      const res = await axios.get(apis[i]);
      const data = i === 0 ? res.data.result : res.data?.data;
      const url = data?.download_url || data?.url;
      if (!url) throw new Error("*SIRF YOUTUBE VIDEO LINK DO 🤗*");

      return {
        title: data.title || video.title,
        thumbnail: data.thumbnail || video.thumbnail,
        download_url: url,
        quality: data.quality || (i === 0 ? "HD" : "Standard"),
      };
    } catch (e) {
      if (i === apis.length - 1) throw new Error("API ERROR 😢");
    }
  }
}

// -------------------
// Helper: Styled Preview
// -------------------
async function sendStyledPreview(conn, from, mek, video, info) {
  const caption = `*👑 VIDEO INFO 👑*\n\n` +
                  `*👑 NAME :❯ ${info.title}*\n` +
                  `*👑 TIME :❯ ${video.timestamp}*\n` +
                  `*👑 VIEWS :❯ ${video.views.toLocaleString()}*\n` +
                  `*👑 QUALITY :❯ ${info.quality}*\n` +
                  `*👑 PUBLISHED :❯ ${video.ago}*\n\n` +
                  `*👑 BILAL-MD WHATSAPP BOT 👑*`;

  await conn.sendMessage(from, {
    image: { url: info.thumbnail },
    caption,
    contextInfo: {
      externalAdReply: {
        title: "👑 BILAL-MD 👑",
        body: "🌹 YOUTUBE VIDEO 🌹",
        thumbnailUrl: info.thumbnail,
        sourceUrl: video.url,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  }, { quoted: mek });
}

// -------------------
// Helper: Styled Video
// -------------------
async function sendStyledVideo(conn, from, mek, video, info) {
  const caption = `*👑 VIDEO DOWNLOADED 👑*\n\n` +
                  `*👑 BY 👑*\n` +
                  `*👑 BILAL-MD 👑*`;

  await conn.sendMessage(from, {
    video: { url: info.download_url },
    mimetype: "video/mp4",
    caption,
    contextInfo: {
      externalAdReply: {
        title: "👑 BILAL-MD VIDEO 👑",
        body: "🌹 YOUTUBE VIDEO 🌹",
        thumbnailUrl: info.thumbnail,
        sourceUrl: video.url,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  }, { quoted: mek });
}
