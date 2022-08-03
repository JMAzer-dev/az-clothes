import { Layout } from '../components/Layout';
import { ProductItem } from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import React, { useContext, useState } from 'react';
import axios from 'axios';
//context_utils
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import LoadState from '../components/LoadState';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [loading, setLoading] = useState(false);

  const addToCartHandler = async (product) => {
    setLoading(true);
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`api/products/${product._id}`);

    if (quantity > data.countInStock) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    
    setLoading(false);
    toast.success('Product added to cart');
  };

  return (
    <Layout title="Home Page">
      <LoadState loading={loading} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <ProductItem
            product={item}
            key={item.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
