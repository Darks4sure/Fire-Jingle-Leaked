const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'welcomereset',
    category: 'welcomer',
    run: async (client, message, args) => {
        if (message.guild.memberCount < 5) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:crs:1304817967413854209> | Your Server Doesn't Meet My 5 Member Criteria`
                        )
                ]
            })
        }
        const settings = await getSettingsar(message.guild)
        let response
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
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
        let status = settings.welcome.enabled
        if (status !== true) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `The welcomer module for this server is already disabled.`
                        )
                ]
            })
        }
        await reset(client, settings)
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:tk:1304818061034917979> | Successfully reset the welcomer module.`
                    )
            ]
        })
    }
}

async function reset(client, settings) {
    ;(settings.welcome.enabled = false),
        (settings.welcome.channel = null),
        (settings.welcome.content = null),
        (settings.welcome.autodel = 0),
        (settings.welcome.embed = {
            image: null,
            description: null,
            color: null,
            title: null,
            thumbnail: false,
            footer: null
        })
    settings.save()
}
