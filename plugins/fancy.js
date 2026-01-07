const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "fancy",
  alias: ["font", "style", "textfont", "fancyname", "ftext", "fancymsg", "fonts"],
  react: "🥺",
  desc: "Convert text into various fancy fonts.",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {

    // ❌ Agar koi text nahi diya
    if (!q) {
      return reply(
        "*APKO APNE NAME KO FANCY TEXT ME STYLISH BANANA HAI ☺️♥️*\n" +
        "*TO AP ESE LIKHO 🥰🌹*\n\n" +
        "*❮FANCY BILAL-MD❯*\n\n" +
        "*JAB ESE LIKHE GE TO APKA NAMES FANCY TEXT ME SHOW HOGE ☺️♥️*"
      );
    }

    // 🔗 API call
    const apiUrl = `https://www.movanest.xyz/v2/fancytext?word=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return reply("*DUBARA KOSHISH KARE 🥺💓*");
    }

    // ✅ All fancy fonts joined
    const fonts = data.result.map(item => item.result).join("\n\n");

    const resultText = `*APKE NAME KE FANCY TEXT ☺️💞*\n\n${fonts}\n\n*👑 BILAL-MD WHATSAPP BOT 👑*`;

    // 📝 Send result
    await conn.sendMessage(from, { text: resultText }, { quoted: mek });

    // 😊 Success reaction
    await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

  } catch (err) {
    console.error("❌ Fancy command error:", err.message);
    await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
    reply("*DUBARA KOSHISH KARE 🥺💓*");
  }
});
