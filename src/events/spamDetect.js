// I get spam detect system from MrJAwesome!
const { Events } = require("discord.js");
const spam = require("../Schemas/spamDetectMainSchema");
const setup = require("../Schemas/spamDetectSetupSchema");

var count = 0;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.guild) return;

    var data = await spam.findOne({
      Guild: message.guild.id,
      User: message.author.id,
    });
    var data2 = await setup.findOne({ Guild: message.guild.id });

    if (!data2) return;

    count++;

    if (data) {
      const query = { Guild: message.guild.id, User: message.author.id };
      const update = { Count: count, Time: Date.now() };
      await spam.updateOne(query, { $set: update });
    } else {
      await spam.create({
        Guild: message.guild.id,
        User: message.author.id,
        Count: count,
        Time: Date.now(),
      });
    }

    if (!data) return;

    var execute;
    if ((Date.now() - data.Time) / 1000 <= 2 /*seconds */ && count >= 10) {
      const member = await message.guild.members.fetch(message.author.id);

      const messages = await message.channel.messages.fetch();
      var memMessages = [];
      await messages.forEach(async (m) => {
        if (m.author.id == member.id && memMessages.length < 5)
          memMessages.push(m.id);
      });

      await memMessages.forEach(async (value) => {
        const fMessage = await message.channel.messages.fetch(value);
        await fMessage.delete().catch((err) => {});
      });

      var error;
      await member.timeout(100000).catch((err) => {
        error = true;
      });

      count = 0;
      await spam.deleteOne({
        Guild: message.guild.id,
        User: message.author.id,
      });

      if (error) return;
      else execute = true;
    }

    if (execute) {
      execute = false;
      await message.author
        .send(
          `⚠️ You have been penalized for performing a prohibited action on the ${message.guild.name} server. You now are timed out.\n\n\`Spam Detection System\``
        )
        .catch((err) => {});

      if (data2.Channel) {
        var channel = await message.guild.channels.fetch(data2.Channel);
        await channel.send(
          `⚠️ I have timed out ${message.author} for spamming in ${message.channel}!\nReason: \`Sending more than 5 messages in 5 seconds\`\n\nPlease take an action  during this time to keep the server in order.`
        );
      }
    }
  },
};
