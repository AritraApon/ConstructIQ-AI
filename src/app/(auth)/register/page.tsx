export const dynamic = "force-dynamic";
import RegisterFrom from '@/components/auth/RegisterForm';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Register Your Account",
  description: "Construct IQ AI",
};

const RegisterPage = () => {
    return (
        <div>
            <RegisterFrom/>
        </div>
    );
};

export default RegisterPage;