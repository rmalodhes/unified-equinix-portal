import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import Cart from "./pages/Cart";
import Packages from "./pages/Packages";
import Quotes from "./pages/Quotes";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";
import QuoteDetails from "./pages/QuoteDetails";
import QuoteOverview from "./pages/QuoteOverview";
import ItemConfiguration from "./pages/ItemConfiguration";
import ViewOrder from "./pages/ViewOrder";
import Configuration from "./pages/Configuration";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orderDetails" element={<OrderDetails />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quoteDetails" element={<QuoteDetails />} />
        <Route path="/quote-overview/:id" element={<QuoteOverview />} />
        <Route
          path="/configure-item/:quoteId/:itemIndex"
          element={<ItemConfiguration />}
        />
        <Route
          path="/configuration/:quoteId/:itemIndex"
          element={<Configuration />}
        />
        <Route path="/viewOrder" element={<ViewOrder />} />
      </Routes>
    </div>
  );
}

export default App;
