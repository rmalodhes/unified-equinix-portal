import React, { createContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StoreContext = createContext();

// Helper functions for localStorage
const loadFromStorage = () => {
  try {
    const savedState = localStorage.getItem("equinixPortalStore");
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem("equinixPortalStore", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const initialState = {
  cart: [],
  packages: [],
  quotes: [],
  orders: [],
  selectedIBX: "MB2",
  selectedCage: "A-101",
};

// Load initial state from localStorage or use default
const getInitialState = () => {
  const savedState = loadFromStorage();
  if (!savedState) return initialState;

  // Sanitize loaded data to ensure quotes and orders have proper items arrays and status
  const sanitizedState = {
    ...initialState,
    ...savedState,
    quotes: (savedState.quotes || []).map((quote) => ({
      ...quote,
      items: Array.isArray(quote.items) ? quote.items : [],
      status: quote.status || "pending",
    })),
    orders: (savedState.orders || []).map((order) => ({
      ...order,
      items: Array.isArray(order.items) ? order.items : [],
      status: order.status || "pending",
    })),
  };

  return sanitizedState;
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
    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: action.payload.quantity }
            : item
        ),
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
    case "UPDATE_PACKAGES_QUANTITY":
      return {
        ...state,
        packages: state.packages.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: action.payload.quantity }
            : item
        ),
      };
    case "CREATE_QUOTE": {
      const generateQuoteId = () => {
        const prefix = "1-";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomSuffix = "";
        for (let i = 0; i < 8; i++) {
          randomSuffix += chars.charAt(
            Math.floor(Math.random() * chars.length)
          );
        }
        return `${prefix}${randomSuffix}`;
      };

      const quoteId = action.payload.id || generateQuoteId();
      return {
        ...state,
        quotes: [
          ...state.quotes,
          {
            ...action.payload,
            id: quoteId,
            quoteNumber: action.payload.quoteNumber || quoteId,
          },
        ],
      };
    }
    case "ADD_QUOTE":
      return {
        ...state,
        quotes: [...state.quotes, action.payload],
      };
    case "UPDATE_QUOTE":
      return {
        ...state,
        quotes: state.quotes.map((quote) =>
          quote.id === action.payload.quoteId
            ? { ...quote, ...action.payload.updatedQuote }
            : quote
        ),
      };
    case "CREATE_ORDER": {
      const generateOrderId = () => {
        const timestamp = Date.now().toString();
        return `1-${timestamp}`;
      };
      const orderId = action.payload.orderNumber || generateOrderId();
      return {
        ...state,
        orders: [
          ...state.orders,
          {
            ...action.payload,
            id: orderId,
            orderNumber: orderId,
          },
        ],
      };
    }
    case "UPDATE_QUOTE_STATUS":
      return {
        ...state,
        quotes: state.quotes.map((quote) =>
          quote.id === action.payload.quoteId
            ? {
                ...quote,
                status: action.payload.status,
                signature: action.payload.signature,
                updatedAt: new Date().toISOString(),
              }
            : quote
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
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
  const [state, dispatch] = useReducer(storeReducer, getInitialState());
  const reactNavigate = useNavigate();

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const navigate = (page) => {
    const routes = {
      home: "/",
      products: "/products",
      solutions: "/solutions",
      cart: "/cart",
      packages: "/packages",
      quotes: "/quotes",
      orders: "/orders",
      profile: "/profile",
      orderDetails: "/orderDetails",
      viewOrder: "/viewOrder",
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
    updateCartQuantity: (id, quantity) =>
      dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id, quantity } }),
    updatePackagesQuantity: (id, quantity) =>
      dispatch({ type: "UPDATE_PACKAGES_QUANTITY", payload: { id, quantity } }),
    createQuote: (itemsOrQuote) =>
      dispatch({
        type: "CREATE_QUOTE",
        payload: Array.isArray(itemsOrQuote)
          ? { items: itemsOrQuote, createdAt: new Date().toISOString() }
          : { createdAt: new Date().toISOString(), ...itemsOrQuote },
      }),
    addQuote: (quote) =>
      dispatch({
        type: "ADD_QUOTE",
        payload: quote,
      }),
    updateQuote: (quoteId, updatedQuote) =>
      dispatch({
        type: "UPDATE_QUOTE",
        payload: { quoteId, updatedQuote },
      }),
    createOrder: (quote) =>
      dispatch({
        type: "CREATE_ORDER",
        payload: { ...quote, createdAt: new Date().toISOString() },
      }),
    updateQuoteStatus: (quoteId, status, signature = null) =>
      dispatch({
        type: "UPDATE_QUOTE_STATUS",
        payload: { quoteId, status, signature },
      }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
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
