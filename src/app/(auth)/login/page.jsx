// Page Login - URL: /login
import AuthLayout from '@/components/auth-form/AuthLayout'
import LoginForm from '@/components/auth-form/LoginForm'

export default function LoginPage() {
    return (

        <div>
            <AuthLayout
                title="Login"
                description="Masuk ke akun Anda"
                image="/images/auth-illustration.png"

            >
                <LoginForm />
            </AuthLayout>
        </div>
    )
}
