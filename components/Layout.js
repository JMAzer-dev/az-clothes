/* eslint-disable @next/next/no-css-tags */
//react
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
//context
import { Store } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CookieConsent from 'react-cookie-consent';
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';

export const Layout = ({ children, title }) => {
  const { status, data: session } = useSession();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const logoutHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <>
      <Head>
        <title>{title ? title + ' - Az Clothes' : 'Az Clothes'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between items-center px-8 shadow-md">
            <Link href="/">
              <a className="text-2xl font-extrabold">Az Clothes</a>
            </Link>
            <div className="text-lg">
              <Link href="/cart">
                <a className="p-2">
                  Cart{' '}
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-8">{children}</main>
        <CookieConsent
          buttonText="OK"
          style={{ backgroundColor: 'rgb(0 0 0 / 0.8)' }}
          debug={false}
          expires={150}
        >
          This website uses cookies to enhance the user experience.{' '}
          <span
            onClick={() =>
              window.open('https://www.cookiesandyou.com/', '_blank')
            }
            className="underline"
          >
            Learn more
          </span>
        </CookieConsent>
        <footer className="flex justify-center sm:p-6 p-4 items-center shadow-inner sm:text-lg text-sm">
          Copyright &copy; 2022 Az Clothes - All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Layout;
