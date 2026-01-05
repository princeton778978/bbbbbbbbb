const axios = require("axios");
const { cmd } = require("../command");
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

/* ───── Fake Meta Quote ───── */
const fakeMeta = (from) => ({
  key: {
    participant: "13135550002@s.whatsapp.net",
    remoteJid: from,
    fromMe: false,
    id: "FAKE_META_TS"
  },
  message: {
    contactMessage: {
      displayName: "Meta AI",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Meta AI;;;;\nFN:Meta AI\nTEL;waid=13135550002:+1 313 555 0002\nEND:VCARD`,
    }
  }
});

/* ───── TikTok Search Logic ───── */
async function tiktokSearch(query) {
  const params = new URLSearchParams({
    keywords: query,
    count: "6",
    cursor: "0",
    HD: "1"
  });

  try {
    const { data } = await axios.post("https://tikwm.com/api/feed/search", params);
    return data?.data?.videos || null;
  } catch (e) {
    return null;
  }
}

/* ───── Command ───── */
cmd({
  pattern: "tiktok",
  alias: ["ts", "ttsearch", "tt"],
  desc: "Search TikTok videos with Download Button",
  react: "🎵",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, args, reply, prefix }) => {

  if (!args.length) return reply(`*AP NE TIKTOK VIDEO DOWNLOAD KARNI HAI TO AP US TIKTOK VIDEO KA LINK COPY KAR LO  🤔*\n*TO AP ESE LIKHO ☺️*\n\n*TIKTOK ❮TIKTOK VIDEO LINK❯*\n*JAB AP ESE LIKHO GE TO APKI TIKTOK VIDEO 😊 DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 😍❣️*`);

  const query = args.join(" ");
  
  try {
    const results = await tiktokSearch(query);
    if (!results) return reply("*TIKTOK VIDEO NAHI MIL RAHI SORRY 😔*");

    const cards = await Promise.all(
      results.slice(0, 6).map(async (vid) => {
        // Thumbnail/Video preview for the card
        const media = await prepareWAMessageMedia(
          { video: { url: vid.play } },
          { upload: conn.waUploadToServer }
        );

        return {
          body: proto.Message.InteractiveMessage.Body.fromObject({ 
            text: vid.title || "*👑 TIKTOK VIDEO 👑*" 
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: "Select to Download"
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: true,
            videoMessage: media.videoMessage
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "📥 Download Video",
                  id: `${prefix}ttdl ${vid.play}` // Yeh id niche wale hidden command ko trigger karegi
                })
              }
            ]
          })
        };
      })
    );

    const msg = generateWAMessageFromContent(from, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: { text: `*TIKTOK SEARCH :❯* ${query}` },
            footer: { text: "*BILAL-MD TIKTOK*" },
            carouselMessage: { cards }
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    reply("❌ Error occurred while searching.");
  }
});

/* ───── Hidden Downloader Command ───── */
// Ye command button click hone par background mein chalega
cmd({
  pattern: "ttdl",
  dontAddCommandList: true, // List mein show nahi hoga
}, async (conn, m, store, { from, args }) => {
  if (!args.length) return;
  
  try {
    const videoUrl = args[0];
    await conn.sendMessage(from, { 
      video: { url: videoUrl }, 
      caption: "*👑 BY :❯ BILAL-MD 👑*",
      fileName: `tiktok.mp4` 
    }, { quoted: m });
  } catch (e) {
    conn.sendMessage(from, { text: "❌ Download failed." });
  }
});
            
