import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReducer, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import LoadState from '../../../components/LoadState';
import { getError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const AdminProductEditScreen = () => {
  const { query } = useRouter();

  const productId = query.id;

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('category', data.category);
        setValue('brand', data.brand);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className="font-bold border-b">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="my-6 text-2xl font-bold">
            Edit Product
            <span className="text-blue-600 ml-2">
              {productId.substring(20, 24)}
            </span>
          </h1>
          {loading ? (
            <LoadState loading={loading} />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="l-form">
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="card  max-w-screen-sm py-16 px-8 md:w-[90%] xl:w-[70%]"
              >
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
                    id="slug"
                    type="text"
                    className="form_input"
                    placeholder=" "
                    {...register('slug', {
                      required: 'Please enter slug',
                    })}
                  />
                  <label htmlFor="slug" className="form_label cursor-text">
                    Slug
                  </label>
                </div>
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
                <div className="form_div mt-4">
                  <input
                    id="price"
                    type="number"
                    className="form_input"
                    placeholder=" "
                    {...register('price', {
                      required: 'Please enter the price',
                    })}
                  />
                  <label htmlFor="price" className="form_label cursor-text">
                    Price
                  </label>
                </div>
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
                <div className="form_div mt-4">
                  <input
                    id="image"
                    type="text"
                    className="form_input"
                    placeholder=" "
                    {...register('image', {
                      required: 'Please enter the image',
                    })}
                  />
                  <label htmlFor="image" className="form_label cursor-text">
                    Image
                  </label>
                </div>
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
                <div className="form_div mt-4">
                  <input
                    id="category"
                    type="text"
                    className="form_input"
                    placeholder=" "
                    {...register('category', {
                      required: 'Please enter the category',
                    })}
                  />
                  <label htmlFor="category" className="form_label cursor-text">
                    Category
                  </label>
                </div>
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
                <div className="form_div mt-4">
                  <input
                    id="brand"
                    type="text"
                    className="form_input"
                    placeholder=" "
                    {...register('brand', {
                      required: 'Please enter the brand',
                    })}
                  />
                  <label htmlFor="brand" className="form_label cursor-text">
                    Brand
                  </label>
                </div>
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
                <div className="form_div mt-4">
                  <input
                    id="countInStock"
                    type="number"
                    className="form_input"
                    placeholder=" "
                    {...register('countInStock', {
                      required: 'Please enter the countInStock',
                    })}
                  />
                  <label
                    htmlFor="countInStock"
                    className="form_label cursor-text"
                  >
                    Count In Stock
                  </label>
                </div>
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
                <div className="form_div mt-4">
                  <input
                    id="description"
                    type="text"
                    className="form_input"
                    placeholder=" "
                    {...register('description', {
                      required: 'Please enter the description',
                    })}
                  />
                  <label
                    htmlFor="description"
                    className="form_label cursor-text"
                  >
                    Description
                  </label>
                </div>
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
                <div className="flex items-center justify-between mt-8">
                  <Link href="/admin/products">
                    <a className="hover:underline">Back</a>
                  </Link>
                  <button
                    type="submit"
                    className="form_button"
                    disabled={loadingUpdate}
                  >
                    {loadingUpdate ? 'Loading' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

AdminProductEditScreen.auth = { adminOnly: true };

export default AdminProductEditScreen;
