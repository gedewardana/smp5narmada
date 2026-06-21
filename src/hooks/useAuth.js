// hooks/useAuth.js
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const { data: session, status } = useSession();
    // const router = useRouter();

    const isLoading = status === "loading";
    const user = session?.user ?? null;

    const login = async (email, password) => {
        // await signOut({ redirect: false });
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            // callbackUrl: "/user/dashboard",
        });

        if (res?.error) {
            throw new Error(res.error); // 
        }

        // refresh halaman
        // router.refresh();

        // manual redirect
        window.location.href = "/user/dashboard"


    };

    const logout = async () => {
        await signOut({ redirect: false });
        window.location.href = "/login"
    };


    return { user, isLoading, login, logout };
}