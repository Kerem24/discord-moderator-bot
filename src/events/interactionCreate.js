const { Events } = require("discord.js");
const messageConfig = require("../messageConfig.json");
const clc = require("cli-color");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        clc.red(
          messageConfig.commandNotFound +
            `No command matching ${interaction.commandName} was found.`
        )
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: messageConfig.executeCommandError,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: messageConfig.executeCommandError,
          ephemeral: true,
        });
      }
    }
  },
};
