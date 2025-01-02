const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'unbanall',
    aliases: ['uall'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
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
        message.guild.bans.fetch().then((bans) => {
            if (bans.size == 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:crs:1304817967413854209> | There is no one banned in this server.`
                            )
                    ]
                })
            } else {
                let i = 0
                bans.forEach((ban) => {
                    message.guild.members.unban(ban.user.id)
                    i++
                })
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:tk:1304818061034917979> | Successfully *Unbanned* \`${i}\` users from the server.`
                            )
                    ]
                })
            }
        })
    }
}
