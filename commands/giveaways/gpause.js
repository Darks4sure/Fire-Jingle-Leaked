const { MessageEmbed } = require('discord.js');
const { activeGiveaways } = require('./gstart'); // Import active giveaways object

module.exports = {
    name: 'gpause',
    description: 'Pause an ongoing giveaway.',
    category: 'giveaway',
    usage: 'gpause <message_id>',

    async run(client, message, args) {
        const giveawayId = args[0];

        if (!giveawayId) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please provide the giveaway message ID to pause the giveaway.')
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

        // Check if giveaway is already paused
        if (giveaway.paused) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> The giveaway is already paused.')
                        .setColor('RED')
                ]
            });
        }

        // Pause the giveaway
        clearTimeout(giveaway.timer);

        // Mark the giveaway as paused
        giveaway.paused = true;

        // Send a confirmation message
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`<:anxCross:1317554876712222794> The giveaway for **${giveaway.prize}** has been paused by ${message.author}.`)
                    .setColor('RED')
            ]
        });

        // Save the remaining time before pausing
        giveaway.remainingTime = giveaway.remainingTime - (Date.now() - giveaway.endTime);

        // Update the embed to indicate the giveaway is paused
        const pausedEmbed = new MessageEmbed()
            .setTitle('🎉 FlaMe Giveaway Paused!🎉')
            .setDescription(`**<:dot:1314799225120227388> Prize:** ${giveaway.prize}
**<:dot:1314799225120227388> Duration:** ${giveaway.remainingTime / 1000}s (paused)
**<:dot:1314799225120227388> Hosted By:** ${giveaway.host}`)
            .setColor('BLACK')
            .setFooter('Giveaway paused, use gresume to resume.');

        giveaway.message.edit({ embeds: [pausedEmbed] });
    },
};
