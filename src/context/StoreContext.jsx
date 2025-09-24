import React, { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const StoreContext = createContext();

const initialState = {
  cart: [],
  packages: [],
  quotes: [],
  orders: [],
  selectedIBX: "SV1",
  selectedCage: "A-101",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, id: Date.now() }],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "ADD_TO_PACKAGES":
      return {
        ...state,
        packages: [...state.packages, { ...action.payload, id: Date.now() }],
      };
    case "REMOVE_FROM_PACKAGES":
      return {
        ...state,
        packages: state.packages.filter((item) => item.id !== action.payload),
      };
    case "CREATE_QUOTE":
      return {
        ...state,
        quotes: [...state.quotes, { ...action.payload, id: `Q-${Date.now()}` }],
      };
    case "CREATE_ORDER":
      return {
        ...state,
        orders: [...state.orders, { ...action.payload, id: `1-${Date.now()}` }],
      };
    case "SET_IBX":
      return {
        ...state,
        selectedIBX: action.payload,
      };
    case "SET_CAGE":
      return {
        ...state,
        selectedCage: action.payload,
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const reactNavigate = useNavigate();

  const navigate = (page) => {
    const routes = {
      home: "/",
      cart: "/cart",
      packages: "/packages",
      quotes: "/quotes",
      orders: "/orders",
      profile: "/profile",
      orderDetails: "/orderDetails",
    };

    const path = routes[page] || (page.startsWith("/") ? page : `/${page}`);
    reactNavigate(path);
  };

  const actions = {
    addToCart: (item) => dispatch({ type: "ADD_TO_CART", payload: item }),
    removeFromCart: (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id }),
    addToPackages: (item) =>
      dispatch({ type: "ADD_TO_PACKAGES", payload: item }),
    removeFromPackages: (id) =>
      dispatch({ type: "REMOVE_FROM_PACKAGES", payload: id }),
    createQuote: (items) =>
      dispatch({
        type: "CREATE_QUOTE",
        payload: { items, createdAt: new Date().toISOString() },
      }),
    createOrder: (quote) =>
      dispatch({
        type: "CREATE_ORDER",
        payload: { ...quote, createdAt: new Date().toISOString() },
      }),
    setSelectedIBX: (ibx) => dispatch({ type: "SET_IBX", payload: ibx }),
    setSelectedCage: (cage) => dispatch({ type: "SET_CAGE", payload: cage }),
    navigate,
    getCartTotal: () =>
      state.cart.reduce((total, item) => total + (item.price || 0), 0),
    getPackagesTotal: () =>
      state.packages.reduce((total, item) => total + (item.price || 0), 0),
  };

  return (
    <StoreContext.Provider value={{ ...state, ...actions }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
