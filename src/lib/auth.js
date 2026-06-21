import CredentialsProvider from "next-auth/providers/credentials";
import { validateUser } from "@/services/auth/authServices";
import { loginSchema } from "@/utils/loginvalidation";

//Alurnya: validateUser mengembalikan data user dari database → masuk ke jwt() disimpan di token → session() menyalin dari token ke session → useAuth() baca dari session lewat useSession().

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                try {
                    const result = loginSchema.safeParse(credentials);

                    if (!result.success) {
                        // 🔥 ambil semua error
                        const errors = result.error.errors.map(e => e.message);

                        // gabungkan jadi 1 string
                        throw new Error(errors.join(", "));
                    }

                    const { email, password } = result.data;

                    const user = await validateUser(email, password);

                    if (!user) {
                        throw new Error("Email atau password salah");
                    }

                    return user;

                } catch (error) {
                    throw new Error(error.message);
                }
            },
        }),
    ],

    callbacks: {
        // 1. Saat token dibuat / refresh — masukkan data custom ke token
        async jwt({ token, user }) {
            if (user) {
                token.id_pengguna = user.id_pengguna;
                token.id_pendaftaran = user.id_pendaftaran; // Tambahkan ini
                token.email = user.email;
                token.nama_lengkap = user.nama_lengkap;
                token.role = user.role;
                token.status_akun = user.status_akun;
                token.dibuat_pada = user.dibuat_pada;
            }
            return token;
        },

        // 2. Saat session diakses di frontend — ambil dari token ke session
        async session({ session, token }) {
            session.user.id_pengguna = token.id_pengguna;
            session.user.id_pendaftaran = token.id_pendaftaran; // Tambahkan ini
            session.user.email = token.email;
            session.user.nama_lengkap = token.nama_lengkap;
            session.user.role = token.role;
            session.user.status_akun = token.status_akun;
            session.user.dibuat_pada = token.dibuat_pada;
            return session;
        },
    },

    pages: {
        signIn: "/login", // redirect ke halaman login custom kamu
    },

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
    },

    secret: process.env.NEXTAUTH_SECRET,
};
