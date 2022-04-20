let handler = async m => m.reply(`
🏮 *REGRAS DO BOT*

🔖 _Não chame o bot, se você fizer isso, você será automaticamente bloqueado pelo bot._
    
🔖
_Não faça spam de bot com comandos, se o bot não estiver respondendo, significa que o bot está desativado ou há um problema de internet no final do proprietário._
    
🔖 _Não abuse/desrespeite o bot e seu dono._
    
🔖 _Se você vir algum bug/erro no bot, reporte-o ao proprietário com o comando !bug/report <problem>._
    
🔖 _Se você quiser este bot em seu grupo, entre em contato com o proprietário digitando !owner/creator._
    
🔖_Aproveite o bot e divirta-se._
`.trim()) // Tambah sendiri kalo mau
handler.help = ['rules']
handler.tags = ['info']
handler.command = /^rules$/i

module.exports = handler
