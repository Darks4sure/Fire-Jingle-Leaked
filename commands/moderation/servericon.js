const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'showservericon',
    aliases: ['showguildicon'],
    category: 'info',
    premium: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async (client, message, args) => {
        try {
            // Fetch the guild (server) icon URL
            const serverIcon = message.guild.iconURL({ dynamic: true, size: 1024 });

            if (!serverIcon) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('FF0000') // Red for error
                            .setDescription('This server does not have an icon.')
                    ]
                });
            }

            // Create and send the embed with the server icon
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('00e3ff') // Blue for success
                        .setTitle(`${message.guild.name}'s Icon`)
                        .setImage(serverIcon) // Display the server icon image
                        .setDescription(`[Click here to view the image in full size](${serverIcon})`)
                ]
            });

        } catch (error) {
            console.error('Error fetching server icon:', error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000') // Red for error
                        .setDescription('An error occurred while fetching the server icon.')
                ]
            });
        }
    }
};
