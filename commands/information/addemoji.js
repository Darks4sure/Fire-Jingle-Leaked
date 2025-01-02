const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'addemoji',
    aliases: ['addemote', 'steal'],
    cooldown: 5,
    category: 'info',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | You must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | I must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            })
        }
        let emoji = args[0]
        if (!emoji) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | You didn't provided any emoji to add.`
                        )
                ]
            })
        }
        let emojiId = null
        try {
            emojiId = emoji.match(/([0-9]+)/)[0]
        } catch (err) {}
        if (!emojiId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | You provided an invalid emoji.`
                        )
                ]
            })
        }
        let name = args[1] || 'stolen_emoji'
        let link = `https://cdn.discordapp.com/emojis/${emojiId}`
        try {
            await message.guild.emojis.create(link, name).then((newEmoji) => {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:tk:1304818061034917979> | Successfully added the emoji ${newEmoji.toString()}.`
                            )
                    ]
                })
            })
        } catch (err) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | I was unable to add the emoji.\nPossible Reasons: \`Mass emojis added\`, \`Slots are Full\`.`
                        )
                ]
            })
        }
    }
}
