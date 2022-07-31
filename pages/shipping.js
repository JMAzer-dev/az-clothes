import Cookies from 'js-cookie';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import {useRouter} from 'next/router'

const ShippingScreen = () => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push('/payment')
  };

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  return (
    <Layout title="Shipping">
      <CheckoutWizard activeStep={1} />
      <div className="l-form">
        <form
          className="card mx-auto mt-[50px] max-w-screen-sm py-16 px-8 md:w-[60%] lg:w-[50%]"
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="text-lg form-title relative mb-6">Shipping Address</h1>
          <div className="form_div mb-4">
            <input
              id="fullName"
              type="text"
              className="form_input"
              placeholder=" "
              autoFocus
              {...register('fullName', {
                required: 'Please enter full name',
              })}
            />
            {errors.fullName && (
              <div className="text-red-500">{errors.fullName.message}</div>
            )}
            <label className="form_label cursor-text" htmlFor="fullName">
              Full Name
            </label>
          </div>
          <div className="form_div mb-4">
            <input
              id="address"
              type="text"
              className="form_input"
              placeholder=" "
              {...register('address', {
                required: 'Please enter address',
                minLength: { value: 3, message: 'Enter a valid address' },
              })}
            />
            {errors.address && (
              <div className="text-red-500">{errors.address.message}</div>
            )}
            <label className="form_label cursor-text" htmlFor="address">
              Address
            </label>
          </div>
          <div className="form_div mb-4">
            <input
              id="city"
              type="text"
              className="form_input"
              placeholder=" "
              {...register('city', {
                required: 'Please enter city',
              })}
            />
            {errors.city && (
              <div className="text-red-500">{errors.city.message}</div>
            )}
            <label className="form_label cursor-text" htmlFor="city">
              City
            </label>
          </div>
          <div className="form_div mb-4">
            <input
              id="postalCode"
              type="text"
              className="form_input"
              placeholder=" "
              {...register('postalCode', {
                required: 'Please enter postal code',
              })}
            />
            {errors.postalCode && (
              <div className="text-red-500">{errors.postalCode.message}</div>
            )}
            <label className="form_label cursor-text" htmlFor="postalCode">
              Postal Code
            </label>
          </div>
          <div className="form_div mb-4">
            <input
              id="country"
              type="text"
              className="form_input"
              placeholder=" "
              {...register('country', {
                required: 'Please enter Country',
              })}
            />
            {errors.country && (
              <div className="text-red-500">{errors.country.message}</div>
            )}
            <label className="form_label cursor-text" htmlFor="country">
              Country
            </label>
          </div>
          <div className="mb-4 flex justify-between">
            <button className="form_button">Next</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

ShippingScreen.auth = true;

export default ShippingScreen;
