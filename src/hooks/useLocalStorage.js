import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Custom hook for managing cart in localStorage
export const useCartStorage = () => {
  const [cart, setCart, removeCart] = useLocalStorage("equinix-cart", []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    removeCart();
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.pricing?.startingPrice || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};

// Custom hook for managing drafts in localStorage
export const useDraftStorage = () => {
  const [drafts, setDrafts, removeDrafts] = useLocalStorage(
    "equinix-drafts",
    []
  );

  const saveDraft = (draftData) => {
    const newDraft = {
      id: Date.now(),
      name: draftData.name,
      products: draftData.products,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDrafts((currentDrafts) => [...currentDrafts, newDraft]);
    return newDraft;
  };

  const updateDraft = (draftId, updateData) => {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.id === draftId
          ? { ...draft, ...updateData, updatedAt: new Date().toISOString() }
          : draft
      )
    );
  };

  const deleteDraft = (draftId) => {
    setDrafts((currentDrafts) =>
      currentDrafts.filter((draft) => draft.id !== draftId)
    );
  };

  const getDraft = (draftId) => {
    return drafts.find((draft) => draft.id === draftId);
  };

  const clearAllDrafts = () => {
    removeDrafts();
  };

  return {
    drafts,
    saveDraft,
    updateDraft,
    deleteDraft,
    getDraft,
    clearAllDrafts,
  };
};

export default useLocalStorage;
