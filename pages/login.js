import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';

const LoginScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ email, password }) => {
    console.log(email, password)
  };

  return (
    <Layout title="Login">
      <div className="l-form">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="card mx-auto mt-[50px] max-w-screen-sm py-16 px-8 md:w-[60%] lg:w-[50%]"
        >
          <h1 className="text-lg form-title relative mb-6">Login</h1>
          <div className="form_div">
            <input
              type="text"
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
            <label htmlFor="" className="form_label">
              Email
            </label>
          </div>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
          <div className="form_div mt-4">
            <input
              type="password"
              className="form_input"
              placeholder=" "
              {...register('password', {
                required: 'Please enter the password',
                minLength: {value: 5, message: 'Password is min 5 characters'}
              })}
            />
            <label htmlFor="" className="form_label">
              Password
            </label>
          </div>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
          <div className="flex items-center justify-between mt-8">
            <p className="">
              Don&apos;t have an account? {" "}
              <Link href="/register">Register</Link>
            </p>
            <button type="submit" className="form_button">
              Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LoginScreen;