const { MessageEmbed } = require('discord.js');
const { activeGiveaways } = require('./gstart'); // Import active giveaways object

module.exports = {
    name: 'gresume',
    description: 'Resume a paused giveaway.',
    category: 'giveaway',
    usage: 'gresume <message_id>',

    async run(client, message, args) {
        const giveawayId = args[0];

        if (!giveawayId) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please provide the giveaway message ID to resume the giveaway.')
                        .setColor('RED')
                ]
            });
        }

        // Check if the giveaway is active and paused
        const giveaway = activeGiveaways[giveawayId];
        if (!giveaway || !giveaway.paused) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> No active paused giveaway found with that ID.')
                        .setColor('RED')
                ]
            });
        }

        // Resume the giveaway
        giveaway.paused = false;

        // Restart the giveaway from the remaining time
        giveaway.timer = setTimeout(async () => {
            // Handle giveaway end logic
            await handleGiveawayEnd(giveaway.message, message);
        }, giveaway.remainingTime);

        // Send a confirmation message
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`<:anxCross:1317554876712222794> The giveaway for **${giveaway.prize}** has been resumed by ${message.author}.`)
                    .setColor('GREEN')
            ]
        });

        // Update the embed to indicate the giveaway is resumed
        const resumedEmbed = new MessageEmbed()
            .setTitle('🎉 FlaMe Giveaway Resumed!🎉')
            .setDescription(`**<:dot:1314799225120227388> Prize:** ${giveaway.prize}
**<:dot:1314799225120227388> Duration:** ${giveaway.remainingTime / 1000}s
**<:dot:1314799225120227388> Hosted By:** ${giveaway.host}`)
            .setColor('BLACK')
            .setFooter('Giveaway resumed!');

        giveaway.message.edit({ embeds: [resumedEmbed] });
    },
};
