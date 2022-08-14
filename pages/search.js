import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Layout from '../components/Layout';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import ListComponent from '../components/ListComponent';
import * as Ri from 'react-icons/ri';
import ProductItem from '../components/ProductItem';
import {Pagination} from '@mui/material';

const PAGE_SIZE = 3;

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

const Search = (props) => {
  const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;
  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    router.push({
      pathname: path,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };
  return (
    <Layout title="Search">
      <div>
        <div className="md:grid md:grid-cols-4 md:gap-5">
          <ul className="flex flex-col gap-5">
            <li>
              <span className="text-xl">Category:</span>
              <ListComponent
                values={categories}
                type={category}
                onchange={categoryHandler}
              />
            </li>
            <li>
              <span className="text-xl">Brand:</span>

              <ListComponent
                values={brands}
                type={brand}
                onchange={brandHandler}
              />
            </li>
            <li>
              <span className="text-xl">Price:</span>

              <div className="custom-select">
                <select
                  value={price}
                  onChange={priceHandler}
                  className="search-select"
                >
                  <option value="all">All</option>
                  {prices &&
                    prices.map((val) => (
                      <option key={val.value} value={val.value}>
                        {val.name}
                      </option>
                    ))}
                </select>
                <span className="custom-arrow">
                  <Ri.RiArrowDownSLine size={25} />
                </span>
              </div>
            </li>
            <li>
              <span className="text-xl">Rating:</span>

              <ListComponent
                values={ratings}
                type={rating}
                onchange={ratingHandler}
              />
            </li>
          </ul>
          <div className="md:col-span-3 md:ml-20 mb-20">
            <div className=" flex justify-between items-center">
              <div className="flex flex-col items-start flex-wrap text-xl">
                <div className="underline">
                  {products.length === 0 ? 'No' : countProducts} Results for
                  {query !== 'all' && query !== '' && ': ' + query}
                  {category !== 'all' && ' / ' + category}
                  {brand !== 'all' && ' /  ' + brand}
                  {price !== 'all' && ' / Price: ' + price}
                  {rating !== 'all' && ' / Rating: ' + rating + ' & up'}
                  {(query !== 'all' && query !== '') ||
                  category !== 'all' ||
                  brand !== 'all' ||
                  rating !== 'all' ||
                  price !== 'all' ? (
                    <div className="">
                      <button
                        onClick={() => router.push('/search')}
                        className="px-2 py-1 border mt-1 text-[#fff] bg-[#232f3e] hover:bg-[#131921] rounded-md"
                      >
                        Clear
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <span className="text-xl">Sort by: </span>
                <div className="custom-select">
                  <select
                    value={sort}
                    onChange={sortHandler}
                    className="search-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="lowest">Price: To Hight</option>
                    <option value="highest">Price: To Low</option>
                    <option value="toprated">Reviews</option>
                    <option value="newest">Newest</option>
                  </select>
                  <span className="custom-arrow">
                    <Ri.RiArrowDownSLine size={25} />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex mt-6 gap-4">
              {products &&
                products.map((product) => (
                  <div key={product._id} className=" max-w-[300px]">
                    <ProductItem
                      product={product}
                      addToCartHandler={addToCartHandler}
                    />
                  </div>
                ))}
            </div>
            <nav className="flex justify-center">
              {pages > 1 && (
                <Pagination
                  defaultPage={parseInt(query.page || '1')}
                  count={pages}
                  onChange={pageHandler}
                ></Pagination>
              )}
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
