const { cmd } = require('../inconnuboy');
const gis = require("g-i-s");

cmd({
  pattern: "img",
  alias: ["image", "photo"],
  react: "🖼️",
  category: "media",
  desc: "Search images (all users)",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

  try {
    if (!q) {
      return reply("📸 Image ke liye kuch likho\n\nExample:\n.img cat\n.img sad boy");
    }

    gis(q, async (err, res) => {
      if (err || !res || res.length === 0) {
        return reply("❌ Koi image nahi mili");
      }

      const images = [...new Set(res.map(v => v.url))]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      for (let img of images) {
        await conn.sendMessage(from, {
          image: { url: img }
        }, { quoted: mek });

        await new Promise(r => setTimeout(r, 400));
      }
    });

  } catch (e) {
    console.log("IMG CMD ERROR:", e);
    reply("❌ Error aa gaya");
  }
});
