const { MessageEmbed } = require('discord.js');
const { activeGiveaways } = require('./gstart'); // Import active giveaways object

module.exports = {
    name: 'gstop',
    description: 'Stop an ongoing giveaway.',
    category: 'giveaway',
    usage: 'gstop <message_id>',

    async run(client, message, args) {
        const giveawayId = args[0];

        if (!giveawayId) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please provide the giveaway message ID to stop the giveaway.')
                        .setColor('RED')
                ]
            });
        }

        // Check if the giveaway is active
        const giveaway = activeGiveaways[giveawayId];
        if (!giveaway) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> No active giveaway found with that ID.')
                        .setColor('RED')
                ]
            });
        }

        // Clear the timeout and stop the giveaway
        clearTimeout(giveaway.timer);

        // Remove reactions
        await giveaway.message.reactions.removeAll();

        // Notify that the giveaway was stopped
        giveaway.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`<:anxCross:1317554876712222794> The giveaway for **${giveaway.prize}** has been stopped by ${message.author}.`)
                    .setColor('RED')
            ]
        });

        // Clean up the active giveaway
        delete activeGiveaways[giveawayId];
    },
};
