/* eslint-disable @next/next/no-css-tags */
//react
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext } from 'react';
//context
import { Store } from '../utils/Store';

export const Layout = ({ children, title }) => {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <>
      <Head>
        <title>{title ? title + ' - Az Clothes' : 'Az Clothes'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between items-center px-8 shadow-md">
            <Link href="/">
              <a className="text-lg font-bold">Az Clothes</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2">Cart {cart.cartItems.length > 0 && (
                  <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}</a>
              </Link>
              <Link href="/login">
                <a className="p-2">Login</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-8">{children}</main>
        <footer className="flex justify-center h-10 items-center shadow-inner sm:text-lg text-xs">
          Copyright &copy; 2022 Az Clothes - All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Layout;
