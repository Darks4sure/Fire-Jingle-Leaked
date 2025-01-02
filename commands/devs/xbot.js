const { MessageEmbed } = require('discord.js');
const ricky = ['870991045008179210', '921371951157641216']; // Owner IDs

module.exports = {
    name: 'mbot', // Command name
    aliases: [], // No aliases for this command
    category: 'Owner',
    run: async (client, message, args) => {
        // Check if the user is an authorized owner
        if (!ricky.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('<a:crs:1304817967413854209> You don\'t have permission to use this command!')
                ]
            });
        }

        // If the command is to change bot status (e.g., "bot status idle")
        if (args[0] === 'status') {
            if (!args[1]) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription('<a:crs:1304817967413854209> Please provide a valid status (online, idle, dnd).')
                    ]
                });
            }

            const status = args[1].toLowerCase();
            if (!['online', 'idle', 'dnd'].includes(status)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription('<a:crs:1304817967413854209> Invalid status! Please use `online`, `idle`, or `dnd`.')
                    ]
                });
            }

            // Set the bot's status
            try {
                await client.user.setPresence({
                    status: status, // Set the bot's status
                });

                const successEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`<a:tk:1304818061034917979> Successfully set bot's status to **${status}**.`);

                return message.channel.send({ embeds: [successEmbed] });
            } catch (error) {
                console.error('Error setting bot status:', error);
                const errorEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<a:crs:1304817967413854209> An error occurred while changing the bot\'s status.');
                return message.channel.send({ embeds: [errorEmbed] });
            }
        }

        // If the command is to change bot activity (e.g., "mbot playing <title>")
        if (args[0] === 'playing' || args[0] === 'watching' || args[0] === 'listening') {
            if (args.length < 2) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription('<a:crs:1304817967413854209> Please provide the activity title.')
                    ]
                });
            }

            const activityType = args[0].toLowerCase();
            const activityTitle = args.slice(1).join(' '); // Join remaining args as the title

            const activityTypes = {
                playing: 'PLAYING',
                watching: 'WATCHING',
                listening: 'LISTENING'
            };

            // Set the bot's activity
            try {
                await client.user.setPresence({
                    status: 'online', // Bot is always online when setting activity
                    activities: [{ name: activityTitle, type: activityTypes[activityType] }] // Set the activity
                });

                const successEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`<a:tk:1304818061034917979> Successfully set bot's activity to **${activityType}**: **${activityTitle}**.`);

                return message.channel.send({ embeds: [successEmbed] });
            } catch (error) {
                console.error('Error setting bot activity:', error);
                const errorEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<a:crs:1304817967413854209> An error occurred while changing the bot\'s activity.');
                return message.channel.send({ embeds: [errorEmbed] });
            }
        }

        // If the input doesn't match either 'status' or a valid activity type
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription('<a:crs:1304817967413854209> Invalid command! Use `mbot status <online/idle/dnd>` or `mbot <playing/watching/listening> <title>`.')
            ]
        });
    }
};