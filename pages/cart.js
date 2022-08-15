import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import Link from 'next/link';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadState from '../components/LoadState';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [loading, setLoading] = useState(false)
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const updateCartHandler = async (item, qty) => {
    setLoading(true)
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    setLoading(false)
    return toast.success('Product updated to the cart');
  };
  return (
    <Layout title="Shopping Cart">
      <LoadState loading={loading}/>
      <h1 className="my-4 mt-8 text-2xl font-bold">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}/`}>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={90}
                            height={90}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)} className="px-2 py-1  hover:bg-[#131921] text-white border-2 bg-[#232f3e] rounded-md hover:text-white text-md font-bold shadow-md">
                        <MdClose/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card p-5">
              <ul>
                <li>
                  <div className="pb-3">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                    ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => router.push('login?redirect=/shipping')}
                    className="primary-button w-full mb-4"
                  >
                    {' '}
                    Check Out
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/')}
                    className="primary-button w-full text-center"
                  >
                    Keep buying
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
