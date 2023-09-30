const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'soporte.starrouting@gmail.com',
        pass: 'uhyv gwhx jjqw tcbf'
    }
});

transporter.verify().then(() => {
    console.log('melos pa los emails');
})

module.exports = transporter;