import axios from 'axios';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import LoadState from '../../components/LoadState';
import { getError } from '../../utils/error';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

const AdminProductsScreen = () => {
  const router = useRouter();
  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const createHandler = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
    }).then((result) => {
      if (result.isConfirmed) {
        async function handlerCreate() {
          try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(`/api/admin/products`);
            dispatch({ type: 'CREATE_SUCCESS' });
            toast.success('Product created successfully');
            router.push(`/admin/product/${data.product._id}`);
          } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
          }
        }
        handlerCreate();
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`);
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

  const deleteHandler = (productId) => {
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
            await axios.delete(`/api/admin/products/${productId}`);
            dispatch({ type: 'DELETE_SUCCESS' });
            toast.success('Product deleted successfully');
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
    <Layout title="Admin Products">
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
                <a className="font-bold border-b">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a>Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <div className="flex justify-between items-center max-w-3xl">
            <h1 className="my-6 text-2xl font-bold">Products</h1>
            <button
              className="form_button"
              disabled={loadingCreate}
              onClick={createHandler}
            >
              New Product
            </button>
            {(loadingCreate || loadingDelete || loading) && (
              <LoadState loading={true} />
            )}
          </div>
          {error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">PRICE</th>
                    <th className="p-5 text-left">CATEGORY</th>
                    <th className="p-5 text-left">COUNT</th>
                    <th className="p-5 text-left">RATING</th>
                    <th className="pl-10 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-5">{product._id.substring(20, 24)}</td>
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">{product.price}</td>
                      <td className="p-5">{product.category}</td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">{product.rating}</td>
                      <td className="pl-5">
                        <Link href={`/admin/product/${product._id}`}>
                          <a className="default-button hover:text-black">
                            Edit
                          </a>
                        </Link>
                        <span className='ml-4 text-xl'>|</span>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-600 bg-red-100 py-2 px-3 rounded-lg hover:bg-red-200 shadow-sm"
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

AdminProductsScreen.auth = { adminOnly: true };

export default AdminProductsScreen;
