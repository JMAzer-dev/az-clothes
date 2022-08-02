import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import Layout from '../components/Layout';

const ProfileScreen = () => {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        return toast.error(result.error);
      }
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Update Profile">
      <div className="l-form">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="card mx-auto mt-[50px] max-w-screen-sm py-16 px-8 md:w-[60%] lg:w-[50%]"
        >
          <h1 className="text-lg form-title relative mb-6">Update Profile</h1>
          <div className="form_div">
            <input
              id="name"
              type="text"
              className="form_input"
              placeholder=" "
              {...register('name', {
                required: 'Please enter name',
              })}
            />
            <label htmlFor="name" className="form_label cursor-text">
              Name
            </label>
          </div>
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
          <div className="form_div mt-4">
            <input
              id="email"
              type="email"
              className="form_input"
              placeholder=" "
              {...register('email', {
                required: 'Please enter email',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please enter a valid email',
                },
              })}
            />
            <label htmlFor="email" className="form_label cursor-text">
              Email
            </label>
          </div>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
          <div className="form_div mt-4">
            <input
              id="password"
              type="password"
              className="form_input"
              placeholder=" "
              {...register('password', {
                required: 'Please enter the password',
                minLength: {
                  value: 5,
                  message: 'Password is min 5 characters',
                },
              })}
            />
            <label htmlFor="password" className="form_label cursor-text">
              Password
            </label>
          </div>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
          <div className="form_div mt-4">
            <input
              id="confirmPassword"
              type="password"
              className="form_input"
              placeholder=" "
              {...register('confirmPassword', {
                required: 'Please enter the confirm password',
                validate: (value) =>
                  value === getValues('password') ||
                  'The passwords do not match',
              })}
            />
            <label htmlFor="confirmPassword" className="form_label cursor-text">
              Confirm Password
            </label>
          </div>
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          <div className="flex items-center justify-between mt-8">
            <button type="submit" className="form_button">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

ProfileScreen.auth = true;
export default ProfileScreen;
