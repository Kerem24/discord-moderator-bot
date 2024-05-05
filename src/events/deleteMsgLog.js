const { Events, EmbedBuilder } = require("discord.js");
const log = require("../Schemas/deleteMessageLogSchema");
const { send } = require("process");

module.exports = {
  name: Events.MessageDelete,

  async execute(message) {
    if (!message.guild || !message.author || message.author.bot || !message)
      return;

    var data = await log.findOne({ Guild: message.guild.id });

    if (!data) return;

    var sendChannel = await message.guild.channels.fetch(data.Channel);
    var attachments = await message.attachments.map(
      (attachments) => attachments.url
    );
    var member = message.author;
    var deleteTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Deleted Message")
      .setDescription(`A message deleted ${deleteTime}.`)
      .addFields(
        {
          name: "Message Content",
          value: `> \`${message.content || "No message content"}\``,
        },
        {
          name: "Author",
          value: `> \`${member.username} (${member.id})\``,
        },
        {
          name: "Channel",
          value: `> \`${message.channel.name} (${message.channel.id})\``,
        }
      )
      .setFooter({ text: "By Bacon Bot" })
      .setTimestamp();

    if (attachments.length > 0) {
      embed.addFields({
        name: "Attachments",
        value: attachments.join(" , "),
      });
    }

    await sendChannel.send({ embeds: [embed] });
  },
};
