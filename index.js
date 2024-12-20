require("dotenv").config();
const { Intents, Client, MessageEmbed } = require("discord.js");
const express = require('express');
const ClientStructure = require("./Structures/Client.js");

const app = express();

app.listen(3000, () => console.log("Express server is running on port 3000"));

app.get('/', (req, res) => {
  res.send(`
    <body>
      <center><h1>Made by: Hadaf</h1></center>
    </body>
  `);
});

// List of bot tokens
const BOT_TOKENS = [
  process.env.TOKEN1,
  process.env.TOKEN2,
  // Add more tokens as needed
];

// List of user IDs to monitor
const USER_IDS_TO_MONITOR = [
  "282859044593598464",  // Replace with actual user IDs
  "",
     "",
  // Add more user IDs as needed
];

// Function to create and log in multiple clients
const clients = BOT_TOKENS.map((token) => {
  const client = new ClientStructure({
    partials: ['MESSAGE', 'CHANNEL'],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING,
    ],
  });

  // Event listener for when the bot is ready
  client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} servers`);
  });

  // Event listener for message handling
  client.on('messageCreate', async (message) => {
    // Check if the message author is in the list of user IDs we are monitoring
    if (USER_IDS_TO_MONITOR.includes(message.author.id)) {
      // Prepare the new message to send
      const newMessage = {
        content: message.content || '\u200B',
        embeds: message.embeds.map((embed) => new MessageEmbed(embed)),
        files: message.attachments.map((attachment) => attachment),
      };

      try {
        // Delete the original message and send the new one
        await Promise.all([
          message.delete(),
          message.channel.send(newMessage),
        ]);
      } catch (err) {
        console.error('Error while deleting or resending message:', err);
      }
    }

    // Additional checks for bot's own messages
    if (message.author.id === client.user.id) {
      // Handle messages containing specific phrases
      if (message.content.includes("type these numbers to confirm")) {
        setTimeout(() => {
          message.delete().catch((err) => console.error('Error while deleting message:', err));
        }, 10000); // Delete after 10 seconds
      } else if (message.content.includes("Cool down")) {
        setTimeout(() => {
          message.delete().catch((err) => console.error('Error while deleting message:', err));
        }, 2000); // Delete after 2 seconds
      }
    }
  });

  // Import event and slash command handlers
  require("./Structures/Event")(client);
  require("./Structures/slashCommand")(client);

  // Log in to Discord
  client.login(token).catch(err => console.error('Error logging in with token:', err));

  return client;
});
