import { SignUp } from '@clerk/clerk-react';
import { createUserInAppwrite } from '../utils/appwrite';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      createUserInAppwrite({
        id: user.id,
        fullName: user.fullName ?? undefined,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl
      });
    }
  }, [user]);

  return <div className='flex justify-center items-center h-screen' >
    <SignUp path="/sign-up" 
            routing="path" 
            signInUrl="/sign-in" 
            fallbackRedirectUrl="/" 
            />
    </div>;
}
