const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const messageConfig = require("../../messageConfig.json");
const { channel } = require("process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Provide a specified number to purge messages from the channel"
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to purge messages")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to delete messages from")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  async execute(interaction) {
    try {
      const amount = interaction.options.getInteger("amount");
      const channel =
        interaction.options.getChannel("channel") || interaction.channel;

      if (amount <= 0 || amount > 100) {
        return interaction.reply({
          content:
            "Please provide a number between 1 and 100 for the amount of messages to purge.",
          ephemeral: true,
        });
      }

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      ) {
        return interaction.reply({
          content: "You do not have enough permissions to use this command.",
          ephemeral: true,
        });
      }

      const purgeEmbed = new EmbedBuilder()
        .setDescription(
          "Succesfully purged " + amount + " messages from " + channel.name
        )
        .setColor("Blue");

      const messages = await channel.messages.fetch({ limit: amount });
      await channel.bulkDelete(messages);

      return interaction.reply({
        embeds: [purgeEmbed],
        ephemeral: true,
      });
    } catch (error) {
      console.error(messageConfig.executeCommandError + " :", error);
      return interaction.reply({
        content: messageConfig.executeCommandError,
        ephemeral: true,
      });
    }
  },
};
