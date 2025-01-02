const { MessageEmbed } = require('discord.js');

// Bot owner IDs
const ricky = ['870991045008179210', '921371951157641216'];

module.exports = {
    name: 'extraowner',
    aliases: ['eowner'],
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 5) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | **Your Server Doesn't Meet My 5 Member Criteria.**`
                        )
                ]
            });
        }

        // Check if the command user is the server owner or a bot owner
        if (
            message.author.id !== message.guild.ownerId &&
            !ricky.includes(message.author.id)
        ) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<<a:crs:1304817967413854209> | **Only the Server Owner or Bot Owner Can Use This Command!**`
                        )
                ]
            });
        }

        const option = args[0]?.toLowerCase(); // Get the action (set, reset, or view)
        const prefix = '$'; // Default prefix

        // Embed for command usage instructions
        const usageEmbed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Extra Owner Management**__`)
            .setDescription(
                `**The Extra Owner can manage antinuke settings and whitelisted members. Be cautious before assigning this role.**`
            )
            .addFields([
                { name: `__Set Extra Owner__`, value: `\`${prefix}extraowner set @user\`` },
                { name: `__Reset Extra Owner__`, value: `\`${prefix}extraowner reset\`` },
                { name: `__View Extra Owner__`, value: `\`${prefix}extraowner view\`` },
            ]);

        // If no option is provided, send the usage embed
        if (!option) return message.channel.send({ embeds: [usageEmbed] });

        // Handle "set" option
        if (option === 'set') {
            const user = getUserFromMention(message, args[1]) || client.users.cache.get(args[1]);

            if (!user) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:crs:1304817967413854209> | **Please Provide a Valid User Mention or ID to Set as Extra Owner.**`
                            )
                    ]
                });
            }

            if (user.bot) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:crs:1304817967413854209> | **You Cannot Assign a Bot as an Extra Owner.**`
                            )
                    ]
                });
            }

            await client.db.set(`extraowner_${message.guild.id}`, { owner: user.id });
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:tk:1304818061034917979> | **Successfully Assigned ${user} as Extra Owner.**`
                        )
                ]
            });
        }

        // Handle "reset" option
        else if (option === 'reset') {
            const data = await client.db.get(`extraowner_${message.guild.id}`);
            if (!data) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:crs:1304817967413854209> | **No Extra Owner Is Currently Set for This Server.**`
                            )
                    ]
                });
            }

            await client.db.set(`extraowner_${message.guild.id}`, null);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:tik:1290919640356360212> | **Extra Owner Configuration Has Been Reset.**`
                        )
                ]
            });
        }

        // Handle "view" option
        else if (option === 'view') {
            const data = await client.db.get(`extraowner_${message.guild.id}`);
            if (!data?.owner) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:crs:1304817967413854209> | **No Extra Owner Is Currently Set.**`
                            )
                    ]
                });
            }

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `**The Current Extra Owner Is <@${data.owner}>.**`
                        )
                ]
            });
        }

        // If the option is invalid
        else {
            return message.channel.send({ embeds: [usageEmbed] });
        }
    },
};

// Helper function to extract user from mention
function getUserFromMention(message, mention) {
    if (!mention) return null;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;
    const id = matches[1];
    return message.client.users.cache.get(id);
}