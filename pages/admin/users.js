import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import LoadState from '../../components/LoadState';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

const AdminUsersScreen = () => {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        async function handlerDelete() { 
          try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/users/${userId}`);
            dispatch({ type: 'DELETE_SUCCESS' });
            toast.success('User deleted successfully');
          } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            toast.error(getError(err));
          }
        }
        handlerDelete();
      }
    });
  };

  return (
    <Layout title="Users Management">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a>Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a>Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a>Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="font-bold border-b">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="my-6 text-2xl font-bold">Users Management</h1>
          {loading && <LoadState loading={true} />}
          {error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">EMAIL</th>
                    <th className="p-5 text-left">ADMIN</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-5">{user._id.substring(20, 24)}</td>
                      <td className="p-5">{user.name.substring(0, 10)}</td>
                      <td className="p-5">{user.email}</td>
                      <td className="p-5">{user.isAdmin ? 'Yes' : 'No'}</td>
                      <td className="p-5">
                        <button
                          disabled={loadingDelete}
                          onClick={() => deleteHandler(user._id)}
                          className="ml-1 text-red-600 bg-red-100 py-2 px-3 rounded-lg hover:bg-red-200 shadow-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

AdminUsersScreen.auth = { adminOnly: true };

export default AdminUsersScreen;
