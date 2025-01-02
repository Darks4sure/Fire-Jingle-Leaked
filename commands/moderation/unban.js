const { Message, Client, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'unban',
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | You must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | I must have \`Ban Members\` permissions to execute this command.`
                        )
                ]
            })
        }
        let isown = message.author.id == message.guild.ownerId
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        const ID = args[0]
        if (!ID) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | You didn't provided the id of the member to *Unban*.`
                        )
                ]
            })
        } else {
            const user = await message.guild.bans.fetch(ID)
            if (!user) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:crs:1304817967413854209> | This user isn't banned in this server.`
                            )
                    ]
                })
            } else {
                message.guild.members.unban(ID).catch(() => {
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<a:crs:1304817967413854209> | I was unable to *Unban* that member.`
                                )
                        ]
                    })
                })
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:tk:1304818061034917979> | Successfully unbanned the member.`
                            )
                    ]
                })
            }
        }
    }
}
