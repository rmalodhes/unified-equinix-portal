import React, { useState } from "react";
import {
  ShoppingCart,
  FileText,
  ClipboardList,
  Box,
  Layers,
  X,
} from "lucide-react";
import { useStore } from "../../hooks/useStore";
import EqLogo from "../../assets/EqLogo.png";

const Navbar = () => {
  const { cart, navigate, removeFromCart } = useStore();
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const handleCartClick = () => {
    setCartModalOpen(prev => !prev);
  };

  const handleGoToCart = () => {
    navigate("cart");
    setCartModalOpen(false);
  };

  return (
    <nav className="navbar-premium px-8 py-5 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center cursor-pointer">
            <div className=" p-2 rounded-xl" onClick={() => navigate("home")}>
              <img
                src={EqLogo}
                alt="Equinix Logo"
                className="h-7 filter drop-shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("products")}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
            >
              <Box className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>

            <button
              onClick={() => navigate("solutions")}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
            >
              <Layers className="w-5 h-5" />
              <span className="font-medium">Solutions</span>
            </button>

            <button
              onClick={() => navigate("orders")}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
            >
              <ClipboardList className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </button>
          </div>
        </div>

        {/* Right side - Cart and Quotes with gradients */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("quotes")}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Quotes</span>
          </button>
          
          <div className="relative">
            <button
              onClick={handleCartClick}
              className="relative flex items-center gap-2 px-5 py-2.5 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Cart Modal */}
            {cartModalOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/50 p-6 z-[60] animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-800">Items</div>
                  <button 
                    onClick={() => setCartModalOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-auto">
                  {cart.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-gray-600 font-medium">Your service cart is empty</div>
                      <div className="text-sm text-gray-500 mt-1 mb-4">Add infrastructure services to build your solution</div>
                      <button 
                        onClick={() => {
                          navigate('products')
                          setCartModalOpen(false)
                        }}
                        className="bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                  
                  {cart.map(item => (
                    <div key={item.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.name || item.title}</div>
                          <div className="text-sm text-gray-600 mt-1">Quantity: {item.quantity || 1}</div>
                          <div className="text-sm text-gray-500 mt-1">{item.category || 'Product'}</div>
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <div className="font-bold text-lg text-gray-800">${item.price || 0}/mo</div>
                          {removeFromCart && (
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-xs text-red-600 hover:text-red-800 mt-2 px-2 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Always show Go to Cart button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button 
                    onClick={handleGoToCart}
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {cart.length > 0 ? 'Go to Cart Page' : 'View Cart'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
