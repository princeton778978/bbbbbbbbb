const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../inconnuboy');

// Function to convert text to plain uppercase
const toUpper = (str) => str.toUpperCase();
const normalize = str => str.toLowerCase().replace(/\s+menu$/, '').trim();

// =============================================================
// 📌 COMMANDE MENU
// =============================================================
cmd({
  pattern: "menu",
  alias: ["help", "allmenu", "m", "list"],
  use: ".menu",
  desc: "Show all bot commands",
  category: "menu",
  react: "👑",
  filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {

  try {
    const sender = m.sender || mek.key.participant || 'unknown@s.whatsapp.net';
    const totalCommands = commands.length;

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let mn = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}H ${mn}M ${s}S`;
    };

    const prefix = config.PREFIX || ".";
    const mode = config.WORK_TYPE?.toUpperCase() || "PUBLIC";

    // Header Design
    let menu = `*╭━━━〔 BILAL-MD 〕━━━┈⊷*
*┃  👑 USER :❯ @${sender.split("@")[0]}*
*┃  👑 MODE :❯ ${mode}*
*┃  👑 PREFIX :❯ ❮ ${prefix} ❯*
*┃  👑 COMMANDS :❯ ${totalCommands}*
*┃  👑 UPTIME :❯ ${uptime()}*
*┃*
*╰━━━━━━━━━━━━━━┈⊷*

*HI G 🤗 YE RAHI MERE BOT KI COMMAND LIST* 🌹`;

    // Grouping Categories
    let categories = {};
    for (let c of commands) {
      if (!c || !c.pattern || !c.category) continue;
      const cat = normalize(c.category);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(c);
    }

    const sortedCats = Object.keys(categories).sort();

    // Loop through Categories
    for (let cat of sortedCats) {
      const catHeader = toUpper(cat);

      menu += `\n\n╭━━━〔 *${catHeader}* 〕━━━┈⊷\n┃`;

      const cmds = categories[cat]
        .filter(c => c.pattern)
        .sort((a, b) => {
          const nameA = Array.isArray(a.pattern) ? a.pattern[0] : a.pattern;
          const nameB = Array.isArray(b.pattern) ? b.pattern[0] : b.pattern;
          return nameA.localeCompare(nameB);
        });

      for (let c of cmds) {
        // Handle pattern if it's an array or string
        const cmdName = Array.isArray(c.pattern) ? c.pattern[0] : c.pattern.split('|')[0];
        menu += `\n┃ 👑 ${prefix}${toUpper(cmdName)}`;
      }

      menu += `\n┃\n╰━━━━━━━━━━━━━━━┈⊷`;
    }

    menu += `\n\n*POWERED BY BILAL-MD* 👑`;

    // Send the Menu
    await conn.sendMessage(from, {
      image: { url: config.IMAGE_PATH || 'https://files.catbox.moe/kunzpz.png' },
      caption: menu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363296818107681@newsletter',
          newsletterName: 'BILAL-MD WHATSAPP BOT',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("❌ Menu error:", e);
    reply(`❌ Error generating menu: ${e.message}`);
  }

});
