const { Events } = require("discord.js");
const clc = require("cli-color");
const { clientId } = require("../config.json");
const mongoose = require("mongoose");
const { mongoURL } = require("../config.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(clc.green("Bot is online"));
    console.log(clc.green("Bot ID: " + clientId));
    client.user.setPresence({
      activities: [
        {
          name: "a moderator for your server | /help",
        },
      ],
      status: "idle",
    });

    if (!mongoURL)
      return console.log(
        clc.yellow("Please enter your mongoURL into the config.json file.")
      );

    await mongoose.connect(mongoURL || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (mongoose.connect) {
      console.log(
        clc.greenBright("[DATABASE] I have connected to the database.")
      );
    } else {
      console.log(
        clc.redBright(
          "[DATABASE WARNING] I cannot connect to the database right now..."
        )
      );
    }
  },
};
