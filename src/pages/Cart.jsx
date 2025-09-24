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
          <div className="flex min-h-[600px]">
            {/* Left Side Stepper */}
            <div className="w-80 bg-white rounded-l-2xl shadow-sm border-r border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items ({allItems.length})
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Click to view details
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  {allItems.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Stepper Line */}
                      {index < allItems.length - 1 && (
                        <div className="absolute left-4 top-12 w-0.5 h-8 bg-gray-200"></div>
                      )}

                      {/* Item in Stepper */}
                      <div
                        onClick={() => setSelectedItems(new Set([index]))}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedItems.has(index)
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {/* Step Number */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            selectedItems.has(index)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Product Name */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-200"></div>

            {/* Right Side Detail Panel */}
            <div className="flex-1 bg-white rounded-r-2xl shadow-sm">
              {selectedItems.size > 0 &&
              allItems[Array.from(selectedItems)[0]] ? (
                <div className="p-6">
                  {(() => {
                    const selectedItem = allItems[Array.from(selectedItems)[0]];
                    return (
                      <>
                        {/* Product Header */}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedItem.name}
                          </h2>
                          <div className="flex items-center gap-4 mb-4">
                            <span
                              className={`px-3 py-1 text-sm rounded-full font-medium ${
                                selectedItem.type === "package"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {selectedItem.type === "package"
                                ? "Package"
                                : "Product"}
                            </span>
                            <span className="text-gray-600">
                              {selectedItem.category}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(selectedItem.price)}
                            <span className="text-base font-normal text-gray-500">
                              /mo
                            </span>
                          </div>
                        </div>

                        {/* First Attribute */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Configuration
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">
                              {getUniqueAttribute(selectedItem)}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/orderDetails?product=${
                                  selectedItem.key ||
                                  selectedItem.id ||
                                  selectedItem.name
                                }&readonly=true`
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={handleGenerateQuote}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            Generate Quote
                          </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Note:</strong> View details to see complete
                            configuration and generate a quote to proceed with
                            ordering.
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an item from the left to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
