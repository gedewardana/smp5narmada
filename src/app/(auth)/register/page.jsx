// Page Register - URL: /register
import AuthLayout from '@/components/auth-form/AuthLayout'
import RegisterForm from '@/components/auth-form/RegisterForm'


export default function RegisterPage() {
    return (
        <>
            <div >

                <AuthLayout
                    title="Registrasi"
                    description="Silahkan Daftar dengan Email Anda!"
                    image="/images/register-illustration.png"
                >
                    <RegisterForm />
                </AuthLayout>
            </div>
        </>
    )
}
