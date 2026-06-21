import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Sistem Informasi Akademik" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset Kata Sandi Anda',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 8px;">
                <h2 style="color: #2563eb; text-align: center;">Reset Kata Sandi</h2>
                <p>Halo,</p>
                <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Silakan klik tombol di bawah ini untuk melanjutkan:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Kata Sandi</a>
                </div>
                <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
                <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    Sistem Informasi Akademik &copy; ${new Date().getFullYear()}
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};
