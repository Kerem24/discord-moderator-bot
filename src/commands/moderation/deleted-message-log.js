const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");
const log = require("../../Schemas/deleteMessageLogSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deleted-message-log")
    .setDescription("Message log system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup a deleted message log system")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send deleted message logs")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription(
          "Remove the deleted message log system from your server"
        )
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute(interaction) {
    const { options } = await interaction;
    const sub = options.getSubcommand();
    var data = await log.findOne({ Guild: interaction.guild.id });

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(message);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    switch (sub) {
      case "setup":
        if (data) {
          await sendMessage(`
                ❌ You have already set up this system before.`);
        } else {
          var channel = options.getChannel("channel");
          await log.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          await sendMessage(
            `✅ I have successfully setup the deleted message log system in ${channel} `
          );
        }
        break;
      case "disable":
        if (!data) {
          await sendMessage("❌ This system has yet to be setup.");
        } else {
          await log.deleteOne({ Guild: interaction.guild.id });
          await sendMessage(
            `✅ I have succesfully disabled deleted message logging system from the server.`
          );
        }
    }
  },
};
