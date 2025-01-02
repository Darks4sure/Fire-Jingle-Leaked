const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invisible',
    aliases: ['in'],
    category: 'mod',
    premium: false,
    run: async (client, message, args) => {
        // Check if the executor is the guild owner or has "Manage Roles" permission
        const isOwner = message.author.id === message.guild.ownerId;
        const isExtraOwner = client.config.extraOwners?.includes(message.author.id);
        if (!isOwner && !isExtraOwner && !message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:crs:1290919638338900104> | You must be the **Guild Owner**, an **Extra Owner**, or have \`Manage Roles\` permission to use this command.`
                        )
                ]
            });
        }

        // Fetch the mentioned user or user ID
        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await message.guild.members.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:crs:1290919638338900104> | Please provide a valid user mention or ID.`
                            )
                    ]
                });
            }
        }

        // Prevent the bot or owner from being targeted
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:crs:1290919638338900104> | You cannot remove roles from me.`
                        )
                ]
            });
        }

        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:crs:1290919638338900104> | You cannot remove roles from the guild owner.`
                        )
                ]
            });
        }

        // Ensure the bot has a higher role than the target
        if (!message.guild.me.permissions.has('MANAGE_ROLES') || message.guild.me.roles.highest.position <= user.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:crs:1290919638338900104> | My role must be higher than the target's highest role to remove their roles.`
                        )
                ]
            });
        }

        try {
            // Remove all roles from the user
            await user.roles.set([]);

            // Send success message
            const successEmbed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<a:tk:1304818061034917979> | Successfully removed all roles from **<@${user.id}> (${user.user.tag})**.`
                );
            return message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            // Handle error if roles could not be removed
            const errorEmbed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:crs:1290919638338900104> | An error occurred while removing roles from **<@${user.id}>**.`
                );
            return message.channel.send({ embeds: [errorEmbed] });
        }
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.guild.members.fetch(id).catch(() => null);
}