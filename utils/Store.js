import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: { cartItems: [] },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      //existItem receberá o valor se o newItem já existir no cart
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      //Adicionando ao state
      // se no cartItems houver existItem, mapeia o cartItems
      // se o existItem tiver o mesmo nome add newItem ao cart
      // se não houver exitItem add ao restante do cart um newItem
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      //pega o state anterior e apenas atualize o cart(mantendo o valor anterior)
      // com os valores guardados anteriormente baseado na expressão anterior
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      //return all cart items except the action payload passed on click function
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
