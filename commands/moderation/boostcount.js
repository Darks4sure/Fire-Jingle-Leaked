const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'boostcount',
    aliases: ['boosts', 'boostlevel'],
    category: 'mod',
    cooldown: 5,
    permissions: ['MANAGE_GUILD'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        // Check if the user has the required permission to manage the server
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription('<:emoji_1725906884992:1306038884992> | You need the `MANAGE_GUILD` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        // Get the server's boost count and boost level
        const boostCount = message.guild.premiumSubscriptionCount; // Number of boosts
        const boostLevel = message.guild.premiumTier; // Boost level (0 = no boosts, 1 = level 1, 2 = level 2, 3 = level 3)

        // Create an embed with the boost count and boost level
        const boostCountEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Server Boost Count and Level')
            .setDescription('Here is the boost count and level for this server:')
            .addField('Boost Count', boostCount.toString(), true)
            .addField('Boost Level', `Level ${boostLevel}`, true)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());

        // Send the embed to the channel
        message.channel.send({ embeds: [boostCountEmbed] });
    }
};
