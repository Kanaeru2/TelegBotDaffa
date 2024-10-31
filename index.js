const { bot, commands } = require('./header');
const handlePhoto = require('./foto');

// Mendaftarkan semua perintah
Object.keys(commands).forEach(command => {
    bot.onText(new RegExp(`^/${command}$`), commands[command]);
});

// Menangkap semua pesan
bot.on('message', (msg) => {
    // Panggil fungsi handlePhoto untuk menangani foto
    handlePhoto(msg);
});

console.log("Bot Running...");
