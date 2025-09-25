import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Eye,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
  Trash2,
} from "lucide-react";
import { useStore } from "../hooks/useStore";

const Cart = () => {
  const {
    cart,
    packages,
    navigate,
    createQuote,
    removeFromCart,
    removeFromPackages,
  } = useStore();
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Combine cart and package items - use stored data as-is
  const allItems = [
    ...cart.map((item) => ({
      ...item,
      type: "product",
      qty: item.qty || 1,
      unitPrice: {
        oneTime: item.oneTimePrice || item.unitPrice?.oneTime || 0,
        recurring: item.price || item.unitPrice?.recurring || 0,
      },
      totalPrice: {
        oneTime:
          (item.oneTimePrice || item.unitPrice?.oneTime || 0) * (item.qty || 1),
        recurring:
          (item.price || item.unitPrice?.recurring || 0) * (item.qty || 1),
      },
      // Use the actual stored configuration data
      selectedOptions: item.selectedOptions || item.configuration || {},
      discounts: item.discounts || [],
      hasDiscount: (item.discounts || []).length > 0,
      // Preserve all other fields that might have been stored
      location: item.location,
      bandwidth: item.bandwidth,
      ibx: item.ibx,
      cage: item.cage,
      description: item.description,
    })),
    ...packages.map((item) => ({
      ...item,
      type: "package",
      qty: item.qty || 1,
      unitPrice: {
        oneTime: item.oneTimePrice || item.unitPrice?.oneTime || 0,
        recurring: item.price || item.unitPrice?.recurring || 0,
      },
      totalPrice: {
        oneTime:
          (item.oneTimePrice || item.unitPrice?.oneTime || 0) * (item.qty || 1),
        recurring:
          (item.price || item.unitPrice?.recurring || 0) * (item.qty || 1),
      },
      // Use the actual stored configuration data
      selectedOptions: item.selectedOptions || item.configuration || {},
      discounts: item.discounts || [],
      hasDiscount: (item.discounts || []).length > 0,
      // Preserve all other fields that might have been stored
      location: item.location,
      bandwidth: item.bandwidth,
      ibx: item.ibx,
      cage: item.cage,
      description: item.description,
    })),
  ];

  // Generate unique quote number in format 1-2QWAM34
  const generateQuoteNumber = () => {
    const prefix = "1-";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomSuffix = "";
    for (let i = 0; i < 8; i++) {
      randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${randomSuffix}`;
  };

  const handleGenerateQuote = () => {
    if (allItems.length === 0) return;

    const quoteId = generateQuoteNumber();
    const quote = {
      id: quoteId,
      quoteNumber: quoteId,
      currency: "USD",
      validUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: allItems,
      total: allItems.reduce((sum, item) => sum + item.price, 0),
      finalTotals: {
        oneTime: allItems.reduce(
          (sum, item) => sum + (item.totalPrice?.oneTime || item.price || 0),
          0
        ),
        recurring: allItems.reduce(
          (sum, item) => sum + (item.totalPrice?.recurring || 0),
          0
        ),
      },
      createdAt: new Date().toISOString(),
      status: "pending",
      customerInfo: {
        name: "John Smith",
        email: "john.smith@company.com",
        company: "Tech Solutions Inc.",
      },
      initialTermMonths: 24,
      renewalPeriodMonths: 12,
      nonRenewalNotice: 90,
    };

    createQuote(quote);
    navigate(`/quoteDetails?id=${quoteId}`);
  };

  const toggleExpanded = (index) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRemoveItem = (index) => {
    const item = allItems[index];
    if (item.type === "product") {
      removeFromCart(item.id);
    } else if (item.type === "package") {
      removeFromPackages(item.id);
    }
  };

  const handleQuantityChange = (index, newQty) => {
    if (newQty < 1) return;

    // For demonstration, we'll just log the change
    // In a real implementation, you'd update the store with the new quantity
    console.log(`Updating item ${index} quantity to ${newQty}`);

    // You would typically call something like:
    // updateCartItemQuantity(allItems[index].id, newQty);
    // or
    // updatePackageQuantity(allItems[index].id, newQty);
  };

  // Calculate totals for all items
  const calculateTotals = (items) => {
    return items.reduce(
      (acc, item) => {
        acc.oneTime += item.totalPrice.oneTime;
        acc.recurring += item.totalPrice.recurring;
        return acc;
      },
      { oneTime: 0, recurring: 0 }
    );
  };

  const totals = calculateTotals(allItems);

  // Format currency helper
  const fmt = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-all duration-200 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Discovery
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Shopping Cart ({allItems.length})
              </h1>
            </div>
          </div>
        </div>

        {allItems.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-white/20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8">
              Discover our services and add items to get started
            </p>
            <button
              onClick={() => navigate("home")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items Section - 70% */}
            <div className="lg:w-[70%]">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Cart Items
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
                {allItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                  >
                    {/* Discount Badge */}
                    {item.hasDiscount && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          15% Off
                        </div>
                      </div>
                    )}

                    <div className="p-6 relative">
                      {/* Delete Button - Top Right */}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-200"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Product Header */}
                      <div className="flex gap-4 mb-4 pr-12">
                        {/* Product Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 9.5V11.5H13.5V9.5C13.5 8.7 12.8 8.2 12 8.2Z" />
                          </svg>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-blue-600 font-semibold text-sm mb-3">
                            {item.category || item.type}
                          </p>

                          {/* Key Configuration Details - Show only 2 most important items */}
                          <div className="mb-4 space-y-2">
                            {(() => {
                              const configs = [];

                              // Priority order for different item types
                              const priorityFields = [
                                "cabinetDimensions",
                                "drawCap",
                                "circuitType",
                                "pduQuantity",
                                "packageType",
                                "serviceLevel",
                                "term",
                                "bandwidth",
                              ];

                              // Find the first 2 available configuration items based on priority
                              for (const field of priorityFields) {
                                if (configs.length >= 2) break;

                                const value = item.selectedOptions?.[field];
                                if (value) {
                                  const label =
                                    value.label || value.id || value;
                                  const displayName = field
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase());

                                  configs.push(
                                    <div
                                      key={field}
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="text-slate-500">
                                        {displayName}:
                                      </span>
                                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                        {label}
                                      </span>
                                    </div>
                                  );
                                }
                              }

                              // If no selectedOptions, try location and bandwidth
                              if (configs.length < 2) {
                                if (item.location && configs.length < 2) {
                                  configs.push(
                                    <div
                                      key="location"
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="text-slate-500">
                                        Location:
                                      </span>
                                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                        {item.location}
                                      </span>
                                    </div>
                                  );
                                }

                                if (item.bandwidth && configs.length < 2) {
                                  configs.push(
                                    <div
                                      key="bandwidth"
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="text-slate-500">
                                        Bandwidth:
                                      </span>
                                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                        {item.bandwidth}
                                      </span>
                                    </div>
                                  );
                                }
                              }

                              return configs.length > 0 ? (
                                configs
                              ) : (
                                <div className="text-xs text-slate-400 italic">
                                  No configuration details available
                                </div>
                              );
                            })()}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-slate-600 font-medium">
                              Qty:
                            </span>
                            <div className="flex items-center border border-slate-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(index, item.qty - 1)
                                }
                                className="p-1.5 hover:bg-slate-100 rounded-l-lg transition-colors"
                                disabled={item.qty <= 1}
                              >
                                <svg
                                  className="w-4 h-4 text-slate-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span className="px-3 py-1.5 text-sm font-semibold bg-slate-50 min-w-[3rem] text-center">
                                {item.qty}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(index, item.qty + 1)
                                }
                                className="p-1.5 hover:bg-slate-100 rounded-r-lg transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 text-slate-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Content Area */}
                      <div className="flex justify-end items-end mb-4">
                        {/* Pricing - Bottom Right */}
                        <div className="text-right">
                          <div className="text-sm text-slate-600">
                            Monthly:{" "}
                            <span className="font-bold text-blue-600">
                              {fmt(item.totalPrice.recurring)}
                            </span>
                          </div>
                          {item.totalPrice.oneTime > 0 && (
                            <div className="text-sm text-slate-600">
                              One-time:{" "}
                              <span className="font-bold text-blue-600">
                                {fmt(item.totalPrice.oneTime)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-4 mt-4"></div>
                      <div className="flex-1">
                        {/* View Details Link */}
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          View Details
                          {expandedItems.has(index) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Divider and Accordion Content - Expandable */}
                      {expandedItems.has(index) && (
                        <div className="pt-4 mt-4">
                          {/* Comprehensive Configuration Details */}
                          <div className="space-y-4">
                            {/* Physical Specifications (for SCE/Infrastructure) */}
                            {(item.selectedOptions?.cabinetDimensions ||
                              item.selectedOptions?.drawCap ||
                              item.selectedOptions?.circuitType ||
                              item.selectedOptions?.pduQuantity) && (
                              <div className="mb-4">
                                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                  Physical Specifications
                                </h4>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
                                  {item.selectedOptions?.cabinetDimensions && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Cabinet Dimensions:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {
                                          item.selectedOptions.cabinetDimensions
                                            .label
                                        }
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.drawCap && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Draw Cap
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.selectedOptions.drawCap.label}
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.circuitType && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Circuit Type:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.selectedOptions.circuitType.label}
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.pduQuantity && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        PDU Quantity:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.selectedOptions.pduQuantity.label}
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.rackUnits && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Rack Units:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.selectedOptions.rackUnits.label}
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.powerType && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Power Type:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.selectedOptions.powerType.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Contract & Location Details */}
                            {(item.location ||
                              item.selectedOptions?.term ||
                              item.ibx ||
                              item.cage) && (
                              <div className="mb-4">
                                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  Contract & Location
                                </h4>
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 space-y-3">
                                  {item.location && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Location:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.location}
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.term && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Contract Term:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.selectedOptions.term.label}
                                      </span>
                                    </div>
                                  )}

                                  {item.ibx && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        IBX:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.ibx}
                                      </span>
                                    </div>
                                  )}

                                  {item.cage && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Cage:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {item.cage}
                                      </span>
                                    </div>
                                  )}

                                  {item.selectedOptions?.installationType && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Installation Type:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {
                                          item.selectedOptions.installationType
                                            .label
                                        }
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Discount Information */}
                          {item.hasDiscount && (
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Tag className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-800">
                                  Discount Applied
                                </span>
                              </div>
                              <p className="text-xs text-emerald-700">
                                Volume discount: Save 15% on monthly charges for
                                quantities over 1 unit.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Section - 30% */}
            <div className="lg:w-[30%] flex-shrink-0">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-5 sticky top-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Items:</span>
                      <span className="font-semibold">{allItems.length}</span>
                    </div>
                    {totals.oneTime > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total One-time:</span>
                        <span className="font-bold text-blue-600">
                          {fmt(totals.oneTime)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Monthly:</span>
                      <span className="font-bold text-emerald-600">
                        {fmt(totals.recurring)}/mo
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <button
                      onClick={handleGenerateQuote}
                      className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FileText className="w-5 h-5" />
                      Generate Quote
                    </button>
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
