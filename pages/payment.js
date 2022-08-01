import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import * as Fa from 'react-icons/fa';
import * as Ai from 'react-icons/ai';

const PaymentScreen = () => {
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <div className="l-form">
        <form
          className="card mx-auto mt-[50px] max-w-screen-sm py-16 px-8 md:w-[60%] lg:w-[50%]"
          onSubmit={submitHandler}
        >
          <h1 className="mb-4 text-xl">Payment Method</h1>
          {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
            <div key={payment} className="w-full mb-4">
              <div className="relative">
                <input
                  name="paymentMethod"
                  type="radio"
                  className="hidden peer"
                  id={payment}
                  checked={selectedPaymentMethod === payment}
                  onChange={() => setSelectedPaymentMethod(payment)}
                />
                <label
                  htmlFor={payment}
                  className="flex gap-4 p-2 rounded-xl bg-[#f0f0f0] bg-opacity-90 backdrop-blur-2xl shadow-sm hover:bg-opacity-75 peer-checked:bg-indigo-200 peer-checked:text-white cursor-pointer items-center"
                >
                  {payment === 'PayPal' && (
                    <div className="text-[#113984]">
                      <Fa.FaPaypal size={40} />
                    </div>
                  )}
                  {payment === 'Stripe' && (
                    <div className="text-[#6772e5]">
                      <Fa.FaStripeS size={35} />
                    </div>
                  )}
                  {payment === 'CashOnDelivery' && (
                    <div className="text-amber-900">
                      <Fa.FaWallet size={35} />
                    </div>
                  )}
                  {payment}
                </label>
                <div className="flex absolute top-0 right-4 bottom-0 w-7 h-7 my-auto rounded-full bg-indigo-500 scale-0 peer-checked:scale-100 transition delay-100 items-center">
                  <div className='text-white mx-auto'>
                    <Ai.AiOutlineCheck size={20}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* buttons */}
          <div className="mb-4 flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/shipping')}
              className="default-button"
            >
              Back
            </button>
            <button className="form_button">Next</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

PaymentScreen.auth = true;


export default PaymentScreen;
