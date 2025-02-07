import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import Button from '../components/Button';
import { default as InputField } from '../components/FormInputField';
import { isAuthenticated } from '../utils/auth';
import { urls } from '../utils/urls';
import { useAuth } from '../context/AuthContext';

interface ILoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>();

  const onSubmit = async (data: ILoginFormValues) => {
    try {
      const response = await axios.post(urls.api.login, data);
      console.info('Login successful:', response.data);

      alert('Login successful!');
      login();
      navigate(urls.home);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Login failed:',
          error.response?.data?.message || error.message,
        );
      } else {
        console.error('Login failed:', (error as Error).message);
      }
      alert('Invalid email or password');
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(urls.home);
    }
  }, []);

  return (
    <form
      className="max-w-[600px] flex flex-col gap-y-8 my-10 mx-auto p-5 sm:p-8 text-center bg-brand-12 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl sm:text-3xl font-semibold">
        Welcome to EvalEase!
      </h1>

      <div className="py-0 sm:py-4">
        <InputField
          label="Email"
          type="email"
          placeholder="my-em@il.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="*********"
          className="mb-0"
          {...register('password', { required: 'Password is required' })}
        />
      </div>
      <Button label="Login" size="large" width="full" type="submit" />
    </form>
  );
}
