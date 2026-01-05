const { cmd } = require('../inconnuboy');
const { setAntideleteStatus, getAntideleteStatus } = require('../data/Antidelete');

cmd({
    pattern: "antidelete",
    alias: ["antidel"],
    desc: "Turn Antidelete on/off",
    category: "owner",
    react: "🛡️"
},
async(conn, mek, m, { args, isOwner, reply, from }) => {
    if (!isOwner) return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'enable') {
        await setAntideleteStatus(from, true);
        await reply("*👑 ANTI-DELETE ACTIVATED 👑*");
    } else if (mode === 'off' || mode === 'disable') {
        await setAntideleteStatus(from, false);
        await reply("*👑 ANTI-DELETE DE-ACTIVATED 👑*");
    } else {
        const current = await getAntideleteStatus(from);
        await reply(`*ABHI ANTI-DELETE* ${current ? "ON" : "OFF"} HAI 😊*`);
    }
});
