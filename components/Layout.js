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
import LoadState from './LoadState';
import * as Bs from 'react-icons/bs';
import * as Fa from 'react-icons/fa';
import { useRouter } from 'next/router';

export const Layout = ({ children, title }) => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [shadow, setShadow] = useState(false);
  const [query, setQuery] = useState('');
  const queryHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const logoutHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  useEffect(() => {
    const handleShaddow = () => {
      if (window.scrollY >= 1) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener('scroll', handleShaddow);
  }, []);

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
        <header className="mb-36  lg:mb-20">
          <nav
            className={
              shadow
                ? 'fixed w-full flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between bg-[#131921]/90 px-8 shadow-xl duration-300 transition ease-in z-[100] py-1'
                : 'fixed w-full flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between px-8 duration-300 transition ease-in bg-[#131921] shadow-xl py-2'
            }
          >
            <div>

            <Link href="/">
                <a className="md:text-2xl text-xl font-extrabold text-white hover:text-white hidden lg:block">
                  Az Clothes
                </a>
              </Link>
            </div>
            <div className="py-2 pb-4">
              <form className="flex items-center" onSubmit={submitHandler}>
                <input
                  type="text"
                  className="border-l-2 border-t-2 border-b-2 border-gray-300 rounded-l-md text-xl w-full lg:w-96 py-2 outline-none"
                  onChange={queryHandler}
                />
                <i
                  className="border-r-2 border-t-2 border-b-2 py-3 px-3 border-gray-300 rounded-r-md  hover:bg-amber-300 text-[#131921] cursor-pointer bg-amber-200"
                  onClick={submitHandler}
                >
                  <Bs.BsSearch size={20} />
                </i>
              </form>
            </div>
            <div className="flex justify-between items-center py-2">
              <Link href="/">
                <a className="text-2xl font-extrabold text-white hover:text-white lg:hidden">
                  Az Clothes
                </a>
              </Link>

              <div className="text-lg flex flex-col md:block">
                <Link href="/cart">
                  <a className="p-2 text-white hover:text-[#dbdbdb]">
                    Cart{' '}
                    {cartItemsCount > 0 && (
                      <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </a>
                </Link>
                {status === 'loading' ? (
                  <LoadState loading={true} />
                ) : session?.user ? (
                  <Menu as="div" className="relative inline-block">
                    <Menu.Button className="text-white hover:text-[#dbdbdb] flex items-center">
                      {session.user.name}{' '}
                      <span className='ml-1'>
                        <Fa.FaUserCircle />
                      </span>
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-[#232f3e] z-[100]">
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link text-white hover:text-white"
                          href="/profile"
                        >
                          Profile
                        </DropdownLink>
                      </Menu.Item>
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link text-white hover:text-white"
                          href="/order-history"
                        >
                          Order History
                        </DropdownLink>
                      </Menu.Item>
                      {session.user.isAdmin && (
                        <Menu.Item>
                          <DropdownLink
                            className="dropdown-link text-white hover:text-white"
                            href="/admin/dashboard"
                          >
                            Admin Dashboard
                          </DropdownLink>
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        <a
                          className="dropdown-link text-white hover:text-white"
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
                    <a className="p-2 text-white hover:text-[#dbdbdb]">Login</a>
                  </Link>
                )}
              </div>
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
              window.open(
                'https://www.cookiesandyou.com/',
                '_blank',
                'noreferer'
              )
            }
            className="underline cursor-pointer"
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
