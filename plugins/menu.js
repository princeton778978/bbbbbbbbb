const { cmd } = require('../inconnuboy');
const config = require('../config');
const os = require('os');
const process = require('process');
const moment = require('moment-timezone');

cmd({
  pattern: "menu",
  alias: ["help", "m", "list"],
  react: "👑",
  category: "menu",
  desc: "Show custom menu message with info",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const sender = m.sender || 'unknown@s.whatsapp.net';

    const prefix = config.PREFIX || ".";
    const mode = config.WORK_TYPE?.toUpperCase() || "PUBLIC";

    // Uptime
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let mns = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}H ${mns}M ${s}S`;
    };

    // Ping calculation
    const start = Date.now();
    await conn.sendPresenceUpdate('composing', from); // dummy update to calculate ping
    const ping = Date.now() - start;

    // Platform
    const platform = `${os.type()} ${os.arch()} Node:${process.version}`;

    // ================= Custom Menu Text =================
    const customMenu = `
*╔══〘 👑 MENU 👑 〙══╗*
*║👑 PREFIX :❯ ❮ ${prefix} ❯*
*║👑 MODE :❯ ${mode}*
*║👑 UPTIME :❯ ${uptime()}*
*║👑 PING :❯ ${ping} MS*
*║👑 PLATFORM :❯ ${platform}*
*╚═════════════════╝*

* HI @${sender.split("@")[0]} G 🥰*
*MERE BOT KA MENU 😍*
*YEH HAI G 😘*

*╔══〘 👑 OWNER 👑 〙══╗
*║ 👑 SETPREFIX*
*║ 👑 AUTOVIEWSTATUS*
*║ 👑 AUTOREAD*
*║ 👑 AUTOLIKESTATUS*
*║ 👑 SETPREFIX*
*║ 👑 WELCOME*
*║ 👑 GOODBYE*
*║ 👑 ANTIDELETE*
*║ 👑 ANTICALL*
*║ 👑 MODE*
*╚═════════════════╝*

*╔══〘 👑 DOWNLOAD 👑 〙══╗*
*║ 👑 VIDEO*
*║ 👑 SONG*
*║ 👑 TIKTOK*
*║ 👑 FB*
*╚═════════════════╝*

*╔══〘 👑 GROUP 👑 〙══╗*
*║ 👑 TAGALL*
*║ 👑 ONLINE*
*╚═════════════════╝*


`;

    await conn.sendMessage(from, {
      image: { url: config.IMAGE_PATH || 'https://files.catbox.moe/kunzpz.png' },
      caption: customMenu,
      contextInfo: { mentionedJid: [sender] }
    }, { quoted: m });

  } catch (err) {
    console.log("MENU ERROR:", err);
    reply("❌ Error aa gaya");
  }
});
