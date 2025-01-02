const { MessageEmbed } = require('discord.js');

const ownerIds = ['870991045008179210', '921371951157641216']; // List of owner IDs

module.exports = {
    name: 'globalwarn',
    aliases: ['gwarn'],
    category: 'Owner',
    run: async (client, message, args) => {
        // Check if the command sender is an authorized owner
        if (!ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:crs:1304817967413854209> You don't have permission to use this command!")
                ]
            });
        }

        // Extract user mention, ID, or reason
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || null;
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:crs:1304817967413854209> Please mention a valid user or provide a valid user ID.")
                ]
            });
        }

        try {
            // Attempt to send DM to the user
            try {
                await user.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('ORANGE')
                            .setTitle('Global Warning Notice')
                            .setDescription(`You have been issued a warning across all servers where this bot is present.`)
                            .addField('Reason:', reason)
                            .setFooter('Please adhere to the rules to avoid further actions.')
                    ]
                });
            } catch (err) {
                console.error(`Couldn't send DM to ${user.tag}:`, err);
            }

            // Notify all servers
            const guilds = client.guilds.cache;
            for (const [_, guild] of guilds) {
                const logChannel = guild.channels.cache.find(
                    (channel) =>
                        channel.name.includes('mod-log') ||
                        channel.name.includes('logs') ||
                        channel.name.includes('general')
                );

                const warningEmbed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle('Global Warning Issued')
                    .setDescription(`A user has been warned globally.`)
                    .addField('User:', `${user.tag} (${user.id})`)
                    .addField('Reason:', reason)
                    .addField('Warned by:', `${message.author.tag}`, true)
                    .setFooter('Please monitor the user’s behavior.');

                if (logChannel) {
                    logChannel.send({ embeds: [warningEmbed] }).catch((err) =>
                        console.error(`Failed to send a message in guild ${guild.name}:`, err)
                    );
                }
            }

            // Confirm action to the command sender
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<a:tk:1304818061034917979> **${user.tag}** has been globally warned.`)
                ]
            });
        } catch (error) {
            console.error('Global warning error:', error);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('<a:crs:1304817967413854209> An error occurred while executing the global warning. Please check the console for details.')
                ]
            });
        }
    }
};