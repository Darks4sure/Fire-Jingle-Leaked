const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'profile',
    aliases: ['badge', 'badges', 'achievement', 'pr'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const user =
            message.mentions.users.first() ||
            client.users.cache.get(args[0]) ||
            message.author

        const stefan = user.id === '1244009539225780384' ? true : false
        let badges = ''

        const guild = await client.guilds.fetch('1238008955528286209')

        const sus = await guild.members.fetch(user.id).catch((e) => {
            if (user) badges = badges
            else badges = '`No Badge Available`'
        })

        if (stefan === true || user.id === '1244009539225780384')
            badges =
                badges +
                `\n<:AZR_crown:1245253365047234571>・**[DraX](https://discord.com/users/1244009539225780384)**`

        const pr = new MessageEmbed()
            .setAuthor(
                `Profile For ${user.username}#${user.discriminator}`,
                client.user.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            //.setTitle(`${user.username}'s Profile`)
            .setColor(client.color)
            .setTimestamp()
            .setDescription(`**BADGES** <:stolen_emoji:1245705472351146005>
  ${badges ? badges : '`No Badge Available`'}`)
        //.setTimestamp();
        message.channel.send({ embeds: [pr] })
    }
}
