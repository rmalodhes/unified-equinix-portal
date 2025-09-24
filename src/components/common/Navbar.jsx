import React from "react";
import {
  User,
  ShoppingCart,
  Package,
  FileText,
  ClipboardList,
} from "lucide-react";
import { useStore } from "../../hooks/useStore";
import EqLogo from "../../assets/EqLogo.png";

const Navbar = () => {
  const { cart, packages, navigate } = useStore();

  return (
    <nav className="navbar-premium px-8 py-5 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="cursor-pointer p-2 rounded-xl"
            onClick={() => navigate("home")}
          >
            <img
              src={EqLogo}
              alt="Equinix Logo"
              className="h-10 filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("packages")}
            className="relative flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Packages</span>
            {packages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {packages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("cart")}
            className="relative flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("quotes")}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Quotes</span>
          </button>

          <button
            onClick={() => navigate("orders")}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </button>

          <button
            onClick={() => navigate("profile")}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-equinix-blue hover:bg-white/70 hover:shadow-md rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-gray-200/50"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
