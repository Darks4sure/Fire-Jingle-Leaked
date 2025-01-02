const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channelcount',
    aliases: ['cc'],
    category: 'mod',
    premium: false,
    run: async (client, message, args) => {
        // Ensure that the command is run in a guild (server)
        if (!message.guild) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription('This command can only be used in a server.')
                ]
            });
        }

        // Get the total number of channels in the server
        const totalChannels = message.guild.channels.cache.size;

        // Create an embed with the total channel count
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Channel Count')
            .setDescription(`This server has a total of **${totalChannels}** channels.`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    }
};
