import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Eye,
  FileText,
  CheckCircle2,
  Check,
  Settings,
  X,
  Tag,
  Trash2,
} from "lucide-react";
import { useStore } from "../hooks/useStore";

const Cart = () => {
  const { cart, packages, navigate, createQuote } = useStore();
  const [selectedItems, setSelectedItems] = useState(new Set([0])); // First item selected by default

  // Combine cart and package items with enhanced data structure
  const allItems = [
    ...cart.map((item) => ({
      ...item,
      type: "product",
      qty: item.qty || 1,
      needsConfiguration: true,
      configurationProgress: 0,
      unitPrice: {
        oneTime: item.oneTimePrice || 500,
        recurring: item.price || 1260,
      },
      totalPrice: {
        oneTime: (item.oneTimePrice || 500) * (item.qty || 1),
        recurring: (item.price || 1260) * (item.qty || 1),
      },
      selectedOptions: item.selectedOptions || {
        cabinetDimensions: {
          label:
            item.configuration?.cabinetDimensions || "600mm × 1200mm × 2200mm",
        },
        drawCap: { label: item.configuration?.drawCap || "3kVA" },
      },
      discounts: item.discounts || [],
      hasDiscount: (item.discounts || []).length > 0,
    })),
    ...packages.map((item) => ({
      ...item,
      type: "package",
      qty: item.qty || 1,
      needsConfiguration: true,
      configurationProgress: 0,
      unitPrice: {
        oneTime: item.oneTimePrice || 750,
        recurring: item.price || 2100,
      },
      totalPrice: {
        oneTime: (item.oneTimePrice || 750) * (item.qty || 1),
        recurring: (item.price || 2100) * (item.qty || 1),
      },
      selectedOptions: item.selectedOptions || {
        packageType: { label: "Complete Bundle", id: "complete" },
        term: { label: "24 months", id: "24mo" },
      },
      discounts: item.discounts || [],
      hasDiscount: (item.discounts || []).length > 0,
    })),
  ];

  // Generate unique quote number in format 1-2QWAM34
  const generateQuoteNumber = () => {
    const prefix = "1-";
    // Generate 8 random alphanumeric characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomSuffix = "";
    for (let i = 0; i < 8; i++) {
      randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${randomSuffix}`;
  };

  const handleGenerateQuote = () => {
    const selectedItemsArray = allItems.filter((_, index) =>
      selectedItems.has(index)
    );
    if (selectedItemsArray.length === 0) return;

    const quoteId = generateQuoteNumber();
    const quote = {
      id: quoteId,
      quoteNumber: quoteId,
      currency: "USD",
      validUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: selectedItemsArray,
      total: selectedItemsArray.reduce((sum, item) => sum + item.price, 0),
      finalTotals: {
        oneTime: selectedItemsArray.reduce(
          (sum, item) => sum + (item.totalPrice?.oneTime || item.price || 0),
          0
        ),
        recurring: selectedItemsArray.reduce(
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

  const handleItemSelection = (index) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(index)) {
      newSelectedItems.delete(index);
    } else {
      newSelectedItems.add(index);
    }
    setSelectedItems(newSelectedItems);
  };

  const getFirstAttribute = (item) => {
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

  const selectedItemsArray = allItems.filter((_, index) =>
    selectedItems.has(index)
  );

  // Calculate totals for selected items
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

  const totals = calculateTotals(selectedItemsArray);

  // Format currency helper
  const fmt = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to remove items
  const handleRemoveItem = (index) => {
    const newSelectedItems = new Set(selectedItems);
    newSelectedItems.delete(index);
    setSelectedItems(newSelectedItems);
    // You would also remove from actual cart here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-all duration-200 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Discovery
          </button>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-slate-600 mt-1 font-medium">
                  Review and manage your selected items
                </p>
              </div>
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
          <div className="flex min-h-[600px] bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Left Side Stepper */}
            <div className="w-80 bg-gradient-to-b from-white/90 to-slate-50/90 border-r border-slate-200/50">
              <div className="p-6 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-slate-800">
                  Cart Items ({allItems.length})
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Select items to view details
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  {allItems.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Stepper Line */}
                      {index < allItems.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                      )}

                      {/* Item in Stepper */}
                      <div
                        onClick={() => handleItemSelection(index)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          selectedItems.has(index)
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md"
                            : "hover:bg-white/70 border border-slate-200 hover:border-blue-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                            selectedItems.has(index)
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 shadow-blue-200"
                              : "border-slate-300 hover:border-blue-400 bg-white"
                          }`}
                        >
                          {selectedItems.has(index) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>

                        {/* Product Name */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate font-medium">
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
            <div className="w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

            {/* Right Side Detail Panel */}
            <div className="flex-1 bg-gradient-to-br from-white/90 to-slate-50/90 relative">
              {selectedItems.size > 0 ? (
                <div className="p-6 pb-20">
                  {selectedItems.size === 1 ? (
                    // Single item detailed view
                    (() => {
                      const selectedItem =
                        allItems[Array.from(selectedItems)[0]];
                      const itemIndex = Array.from(selectedItems)[0];
                      return (
                        <div className="space-y-6">
                          {/* Item Card */}
                          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-200/50 via-white to-indigo-200/50 shadow-xl">
                            <div className="rounded-[15px] bg-white/95 backdrop-blur-sm p-6 border border-white/50">
                              {/* Discount Badge */}
                              {selectedItem.hasDiscount && (
                                <div className="absolute top-3 right-3 z-10">
                                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                    <Tag className="w-3 h-3" />
                                    15% Off
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col gap-6">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-4">
                                    {/* Product Icon */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-blue-100">
                                      <svg
                                        className="w-8 h-8 text-white drop-shadow-sm"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 9.5V11.5H13.5V9.5C13.5 8.7 12.8 8.2 12 8.2Z" />
                                      </svg>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                                        {selectedItem.name}
                                      </h2>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-3">
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
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRemoveItem(itemIndex)
                                      }
                                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
                                      title="Remove item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Configuration Options */}
                                {selectedItem.selectedOptions &&
                                  Object.entries(selectedItem.selectedOptions)
                                    .length > 0 && (
                                    <div className="mb-6">
                                      <div className="flex flex-wrap gap-2">
                                        {Object.entries(
                                          selectedItem.selectedOptions
                                        )
                                          .slice(0, 2)
                                          .map(([key, option]) => {
                                            const displayLabel =
                                              option?.label ||
                                              option?.id ||
                                              "Unknown";
                                            const displayKey = key
                                              .replace("__", "")
                                              .replace(/([A-Z])/g, " $1")
                                              .trim();

                                            return (
                                              <span
                                                key={key}
                                                className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 font-semibold shadow-sm"
                                              >
                                                {displayKey}: {displayLabel}
                                              </span>
                                            );
                                          })}
                                        {selectedItem.qty > 1 && (
                                          <span className="text-xs px-3 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 font-semibold shadow-sm">
                                            Quantity: {selectedItem.qty}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Pricing Details */}
                                <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/60 rounded-2xl p-5 border border-slate-200/50 shadow-inner">
                                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <div className="p-1 bg-gradient-to-br from-emerald-100 to-green-100 rounded-md">
                                      <span className="text-emerald-600 text-xs">
                                        $
                                      </span>
                                    </div>
                                    Pricing Breakdown
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Quantity:
                                      </span>
                                      <span className="font-bold text-slate-800">
                                        {selectedItem.qty}
                                      </span>
                                    </div>

                                    {selectedItem.unitPrice.oneTime > 0 && (
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">
                                          One-time charge (NRC):
                                        </span>
                                        <span className="font-bold text-slate-800">
                                          {fmt(selectedItem.unitPrice.oneTime)}
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-600 font-medium">
                                        Monthly recurring (MRC):
                                      </span>
                                      <span className="font-bold text-slate-800">
                                        {fmt(selectedItem.unitPrice.recurring)}
                                      </span>
                                    </div>

                                    <div className="border-t border-slate-300/50 pt-4 space-y-3 bg-gradient-to-r from-white/50 to-slate-50/50 -m-1 p-4 rounded-xl">
                                      {selectedItem.unitPrice.oneTime > 0 && (
                                        <div className="flex justify-between items-center">
                                          <span className="font-bold text-slate-800">
                                            Total NRC:
                                          </span>
                                          <span className="font-bold text-blue-600 text-lg">
                                            {fmt(
                                              selectedItem.totalPrice.oneTime
                                            )}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-800">
                                          Total MRC:
                                        </span>
                                        <span className="font-bold text-emerald-600 text-lg">
                                          {fmt(
                                            selectedItem.totalPrice.recurring
                                          )}
                                          /mo
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Discount Information */}
                                {selectedItem.hasDiscount && (
                                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="p-1 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full">
                                        <Tag className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="text-sm font-bold text-emerald-800">
                                        Discount Applied
                                      </span>
                                    </div>
                                    <p className="text-xs text-emerald-700 font-medium">
                                      Volume discount: Save 15% on monthly
                                      charges for quantities over 1 unit.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    // Multiple items summary view
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Selected Items ({selectedItems.size})
                        </h2>
                        <button
                          onClick={() => setSelectedItems(new Set())}
                          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Clear Selection
                        </button>
                      </div>

                      {/* Item Cards */}
                      <div className="space-y-4">
                        {selectedItemsArray.map((item, idx) => {
                          const originalIndex = allItems.findIndex(
                            (originalItem) => originalItem === item
                          );
                          return (
                            <div
                              key={idx}
                              className="relative rounded-xl p-[1px] bg-gradient-to-br from-blue-100/50 via-white to-purple-100/50 shadow-sm"
                            >
                              <div className="rounded-[14px] bg-white p-4">
                                {/* Discount Badge */}
                                {item.hasDiscount && (
                                  <div className="absolute top-2 right-2 z-10">
                                    <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded border border-green-200">
                                      15% Off
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-4">
                                  {/* Product Icon */}
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                      className="w-6 h-6 text-blue-600"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 9.5V11.5H13.5V9.5C13.5 8.7 12.8 8.2 12 8.2Z" />
                                    </svg>
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                          {item.name}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium">
                                          {item.category}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            navigate(
                                              `/orderDetails?product=${
                                                item.key || item.id || item.name
                                              }&readonly=true`
                                            )
                                          }
                                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                          View Details
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleRemoveItem(originalIndex)
                                          }
                                          className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                          title="Remove item"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Configuration */}
                                    {item.selectedOptions &&
                                      Object.entries(item.selectedOptions)
                                        .length > 0 && (
                                        <div className="mb-3">
                                          <div className="flex flex-wrap gap-1">
                                            {Object.entries(
                                              item.selectedOptions
                                            )
                                              .slice(0, 3)
                                              .map(([key, option]) => {
                                                const displayLabel =
                                                  option?.label ||
                                                  option?.id ||
                                                  "Unknown";
                                                const displayKey = key.replace(
                                                  "__",
                                                  ""
                                                );

                                                return (
                                                  <span
                                                    key={key}
                                                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                                                  >
                                                    {displayKey}: {displayLabel}
                                                  </span>
                                                );
                                              })}
                                            {Object.entries(
                                              item.selectedOptions
                                            ).length > 3 && (
                                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                                +
                                                {Object.entries(
                                                  item.selectedOptions
                                                ).length - 3}{" "}
                                                more
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                    {/* Pricing */}
                                    <div className="flex items-end justify-between">
                                      <div className="text-xs text-gray-500">
                                        Qty:{" "}
                                        <span className="font-semibold text-gray-700">
                                          {item.qty}
                                        </span>
                                      </div>
                                      <div className="text-right space-y-1">
                                        {item.unitPrice.oneTime > 0 && (
                                          <div className="text-xs text-gray-500">
                                            One-time:{" "}
                                            <span className="font-semibold text-blue-600">
                                              {fmt(item.totalPrice.oneTime)}
                                            </span>
                                          </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                          Monthly:{" "}
                                          <span className="font-semibold text-green-600">
                                            {fmt(item.totalPrice.recurring)}/mo
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Comprehensive Pricing Summary */}
                      <div className="space-y-4">
                        {/* Grand Total */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3">
                            Order Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">
                                Selected Items:
                              </span>
                              <span className="font-semibold text-blue-900">
                                {selectedItems.size}
                              </span>
                            </div>
                            {totals.oneTime > 0 && (
                              <div className="flex justify-between">
                                <span className="text-blue-700">
                                  Total One-time charges:
                                </span>
                                <span className="font-bold text-blue-900">
                                  {fmt(totals.oneTime)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-blue-700">
                                Total Monthly charges:
                              </span>
                              <span className="font-bold text-blue-900">
                                {fmt(totals.recurring)}/mo
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Final Total */}
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-800 text-lg">
                              Grand Total:
                            </span>
                            <div className="text-right">
                              {totals.oneTime > 0 && (
                                <div className="font-bold text-green-600 text-lg">
                                  {fmt(totals.oneTime)}
                                </div>
                              )}
                              <div className="font-bold text-green-600 text-xl">
                                {fmt(totals.recurring)}/mo
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select items from the left to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fixed Generate Quote Button - Bottom Right */}
        {selectedItems.size > 0 && (
          <div className="fixed bottom-8 right-8 z-50 bg-white max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={handleGenerateQuote}
              className="px-8 py-3  text-white rounded-xl font-bold btn-primary transition-all duration-200 flex items-center gap-2 shadow-lg transform hover:scale-105"
            >
              <div className="p-1 bg-white/20 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              Generate Quote ({selectedItems.size} item
              {selectedItems.size > 1 ? "s" : ""})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
