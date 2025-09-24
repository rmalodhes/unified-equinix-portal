import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Eye,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const Cart = () => {
  const { cart, packages, navigate, createQuote } = useStore();
  const [selectedItems, setSelectedItems] = useState(new Set([0])); // First item selected by default

  // Combine cart and package items
  const allItems = [
    ...cart.map((item) => ({ ...item, type: "product" })),
    ...packages.map((item) => ({ ...item, type: "package" })),
  ];

  const handleGenerateQuote = () => {
    const selectedItemsArray = allItems.filter((_, index) =>
      selectedItems.has(index)
    );
    if (selectedItemsArray.length === 0) return;

    const quoteId = `Q-${Math.random()
      .toString(36)
      .substr(2, 7)
      .toUpperCase()}`;
    const quote = {
      id: quoteId,
      items: selectedItemsArray,
      total: selectedItemsArray.reduce((sum, item) => sum + item.price, 0),
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    createQuote(quote);
    navigate(`/quoteDetails?id=${quoteId}`);
  };

  const toggleItemSelection = (index) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const getUniqueAttribute = (item) => {
    if (item.configuration) {
      const keys = Object.keys(item.configuration);
      if (keys.length > 0) {
        const key = keys[0];
        return `${key.replace(/([A-Z])/g, " $1").trim()}: ${
          item.configuration[key]
        }`;
      }
    }
    return item.category || "Standard Configuration";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discovery
          </button>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-equinix-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Review and manage your selected items
          </p>
        </div>

        {allItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <div className="text-gray-500 text-xl mb-4">Your cart is empty</div>
            <button onClick={() => navigate("home")} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Vertical Stepper */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Items ({allItems.length})
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Select items to include in quote
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {allItems.map((item, index) => (
                      <div key={index} className="relative">
                        {/* Stepper Line */}
                        {index < allItems.length - 1 && (
                          <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
                        )}

                        {/* Item Card */}
                        <div
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedItems.has(index)
                              ? "border-blue-200 bg-blue-50/50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          {/* Stepper Circle */}
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              selectedItems.has(index)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {selectedItems.has(index) ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {/* Checkbox */}
                          <div className="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(index)}
                              onChange={() => toggleItemSelection(index)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>

                          {/* Item Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      item.type === "package"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {item.type === "package"
                                      ? "Package"
                                      : "Product"}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {item.category}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {getUniqueAttribute(item)}
                                </p>
                              </div>

                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatCurrency(item.price)}
                                  <span className="text-sm font-normal text-gray-500">
                                    /mo
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/orderDetails?product=${
                                        item.id || item.name
                                      }&readonly=true`
                                    )
                                  }
                                  className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm sticky top-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Selected Items</span>
                      <span className="font-medium">{selectedItems.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Total</span>
                      <span className="font-medium">
                        {formatCurrency(
                          allItems
                            .filter((_, index) => selectedItems.has(index))
                            .reduce((sum, item) => sum + item.price, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Total</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          allItems
                            .filter((_, index) => selectedItems.has(index))
                            .reduce((sum, item) => sum + item.price, 0) * 12
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("home")}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Continue Shopping
                    </button>

                    <button
                      onClick={handleGenerateQuote}
                      disabled={selectedItems.size === 0}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="w-4 h-4" />
                      Generate Quote
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> Prices are estimates. Final pricing
                      will be confirmed in your quote.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
