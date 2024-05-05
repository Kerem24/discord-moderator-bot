const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Events,
  GatewayIntentBits,
  Colors,
  Collection,
} = require("discord.js");
const messageConfig = require("./messageConfig.json"); // Config to give errors or succes messages
const { token, clientId } = require("./config.json"); // Bot settings
const clc = require("cli-color");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

// Command Handler
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    console.log(
      clc.magenta(`[COMMAND] ${command.data.name} loaded from ${filePath}`)
    );
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        clc.red(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        )
      );
    }
  }
}

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    console.log(
      clc.magentaBright(`[EVENT] ${event.name} loaded from ${filePath}`)
    );
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    console.log(
      clc.magentaBright(`[EVENT] ${event.name} loaded from ${filePath}`)
    );
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
