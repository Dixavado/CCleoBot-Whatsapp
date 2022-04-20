let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let levelling = require('../lib/levelling')
const thumb = fs.readFileSync('./src/thumb.jpg')
let tags = {
  'main': '📖 Ajuda 📖',
}
const defaultMenu = {
  before: `
   │ 
  │ 🚀 %name, voce esta no Menu AJUDA!
  │
  │ 📱 Prefixo: *%p*
  │ 📅 Date: *%week*, *%date*
  │ 📅 Tempo Online: *%uptime (%muptime)*
  │ 💠 WebSite: www.ccleo.online
  │
  │ 👇🏻  FAQ & AJUDA

%readmore`.trimStart(),
  after: `💸💳 *© CCLEO BOT © Tropa do Arabe* 💳💸
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'pt'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
        `
        *
        ┏━━━━━≈ ᴄᴄƖєᴏ ʙᴏᴛ ᴠ1.7 ≈━━━━━┓
         |                                
         | 🚀 %name, voce esta no Menu AJUDA!
         │
         │ 📱 Prefixo: *%p*
         │ 📅 Date: *%week*, *%date*
         │ 📅 Tempo Online: *%uptime (%muptime)*
         │ 💠 WebSite: www.ccleo.online
         │
         │
         │ 👨‍💻 Bem Vindo %name a central de ajuda 👨‍💻
         │
         │ 👇🏻  FAQ & AJUDA
         │
         │ 🔧 Problemas relacionados ao BOT: 
         │   www.bot.ccleo.online/suporte
         │
         │ 🎥 Video Tutorial:
         │   YT: www.youtube.com
         |
         ┗━━━━━━━━━━━━━━━━━━━┛
        ◉
        ◉ 👇🏻 AJUDA COM OS COMANDOS
        ◉
        `
     
    ]
    
    .join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      limit, name, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    conn.send2ButtonImg(m.chat, thumb, `🏮 ${conn.user.name}`, text.trim(), '!comandos', `${_p}comandos`, 'Menu', `${_p}menu`, m)
  } catch (e) {
    conn.reply(m.chat, 'Desculpe, o menu tem algum erro', m)
    throw e
  }
}
handler.help = ['help']
handler.tags = ['main']
handler.command = /^(ajuda|help)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
