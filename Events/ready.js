const Discord = require('discord.js');
module.exports = async (client) => {
const dev = await client.users.fetch("648607274071490576")
 
   client.user.setPresence({
        status: "dnd",
        activities: [
            {
                name: "Queen",
                type: "WATCHING"
            }
        ]
    });
    console.log(`Logged in as ${client.user.tag}.`);

}