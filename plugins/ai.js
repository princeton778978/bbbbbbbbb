const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "ai",
  alias: ["gpt", "ask", "chatgpt"],
  react: "🤖",
  category: "ai",
  desc: "Chat with AI",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {

    if (!q) {
      return reply(
        "*🤖 AI COMMAND*\n\n" +
        "Is tarah use karo:\n" +
        "*.ai apna sawal*\n\n" +
        "Example:\n" +
        "*.ai Pakistan ka capital kia hai*"
      );
    }

    // typing feel
    await conn.sendPresenceUpdate('composing', from);

    // 🔗 New API URL
    const API_URL = `https://www.movanest.xyz/v2/powerbrainai?query=${encodeURIComponent(q)}`;

    const res = await axios.get(API_URL, { timeout: 60000 });

    if (res.data && res.data.status && res.data.result) {
      await reply(res.data.result);
    } else {
      await reply("❌ AI se jawab nahi mila");
    }

  } catch (err) {
    console.log("AI COMMAND ERROR:", err.message);
    reply("❌ AI server error / busy hai");
  }
});
