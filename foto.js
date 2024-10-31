const { bot } = require('./header'); // Pastikan untuk mengimpor bot dari header.js

// Fungsi untuk menangani pengiriman foto
const handlePhoto = (msg) => {
    if (msg.photo) {
        const photo = msg.photo[msg.photo.length - 1]; // Ambil ukuran tertinggi

        console.log(`Pesan diterima dari: ${msg.from.username || msg.from.first_name}`);
        console.log(`File ID: ${photo.file_id}`);
        
        // Mengirim kembali foto yang diterima
        bot.sendPhoto(msg.chat.id, photo.file_id, { caption: "Ini foto terbaru yang Anda kirim!" })
            .then(() => {
                console.log("Foto berhasil dikirim kembali.");
            })
            .catch((error) => {
                console.error("Gagal mengirim foto:", error);
            });
    }
};

// Ekspor fungsi handlePhoto
module.exports = handlePhoto;
