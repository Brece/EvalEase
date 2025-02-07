import axios from 'axios';
import { useNavigate } from 'react-router';

import Button from '../components/Button';
import { IUserObject } from '../utils/interfaces';
import { PageLoader } from '../components/PageLoader';
import { urls } from '../utils/urls';
import { useAuth } from '../context/AuthContext';
import { useGetUser } from '../hooks/user/useGetUser';

const userLabels: { [key in keyof IUserObject]: string } = {
  name: 'Name',
  email: 'Email',
  faculty: 'Faculty',
  phone: 'Phone',
};

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: user, isLoading, error } = useGetUser();

  const handleLogout = async () => {
    try {
      const response = await axios.get(urls.api.logout);

      if (!(response.status === 200)) {
        throw new Error('Logout failed');
      }

      alert('Logout successful!');
      logout();
      navigate(urls.login);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Logout failed:',
          error.response?.data?.message || error.message,
        );
      } else {
        console.error('Logout failed:', (error as Error).message);
      }
      alert('An unexpected error occurred. Logout failed');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-[600px] flex flex-col gap-y-8 my-10 mx-auto p-5 sm:p-8 text-center bg-brand-12 rounded-md">
      <h1 className="text-2xl sm:text-3xl font-semibold">Profile Settings</h1>

      <div className="py-0 sm:py-4">
        {user &&
          Object.entries(user).map(([key, value]) =>
            userLabels[key as keyof IUserObject] ? (
              <UserInformationField
                key={key}
                label={userLabels[key as keyof IUserObject]}
                text={value as string}
              />
            ) : null,
          )}
      </div>
      <Button
        label="Logout"
        size="large"
        width="full"
        color="secondary"
        onClick={handleLogout}
      />
    </div>
  );
}

interface IUserInformationFieldProps {
  label: string;
  text: string;
}

function UserInformationField({ label, text }: IUserInformationFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row  mb-10">
      <p className="mr-8 mb-3 sm:mb-0 text-left sm:text-right font-semibold  flex-grow">
        {label}:
      </p>
      <p className="w-full sm:w-[80%] text-left text-brand-5 border-black rounded-md">
        {text}
      </p>
    </div>
  );
}
