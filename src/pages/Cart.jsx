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
    clearCart,
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
    clearCart();
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

  // Check if Secure Cabinet Express is in cart
  const hasSecureCabinet = allItems.some(item => 
    item.name && item.name.toLowerCase().includes('secure cabinet express')
  );

  // Recommendations data
  const recommendations = [
    {
      id: 'equinix-fabric-port',
      name: 'Equinix Fabric Port',
      description: 'High-performance network connectivity port',
      originalPrice: 1200,
      discountedPrice: 960,
      discount: 20,
      badge: 'POPULAR',
      badgeColor: 'bg-orange-500',
      details: [
        { label: 'Type', value: 'Primary' },
        { label: 'Bandwidth', value: '10 Gbps' },
        { label: 'Interface type', value: '10G SMF' },
        { label: 'Encapsulation', value: 'dot1q (TPID 0x8100)' },
        { label: 'Cloud Package Type', value: 'Standard' }
      ],
      icon: '🌐'
    },
    {
      id: 'cross-connect-package',
      name: 'Cross Connect Package',
      description: 'Direct physical connections between equipment',
      originalPrice: 1000,
      discountedPrice: 750,
      discount: 25,
      quantity: 10,
      badge: 'BEST VALUE',
      badgeColor: 'bg-green-500',
      details: [
        { label: 'Package', value: '10 Units' },
        { label: 'Type', value: 'Fiber Cross Connect' },
        { label: 'Media Type', value: 'Single Mode Fiber' },
        { label: 'Installation', value: 'Express Install' }
      ],
      icon: '🔌'
    },
    {
      id: 'smart-hands-support',
      name: 'Smart Hands Support Plan',
      description: '24/7 remote hands and technical support services',
      originalPrice: 800,
      discountedPrice: 640,
      discount: 20,
      quantity: 20,
      badge: 'RECOMMENDED',
      badgeColor: 'bg-blue-500',
      details: [
        { label: 'Coverage', value: '24/7 Support' },
        { label: 'Response Time', value: '< 2 hours' },
        { label: 'Units', value: '20 Hours/Month' },
        { label: 'Priority', value: 'Business Critical' }
      ],
      icon: '🛠️'
    }
  ];

  const { addToCart } = useStore();

  const handleAddRecommendation = (recommendation) => {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === recommendation.id);
    if (existingItem) {
      // If item exists, you might want to show a message or increase quantity
      // For now, we'll just return without adding
      return;
    }

    // Calculate proper pricing structure
    const setupFee = 100;
    const monthlyPrice = recommendation.discountedPrice;
    
    const cartItem = {
      id: recommendation.id,
      name: recommendation.name,
      description: recommendation.description,
      price: monthlyPrice, // Monthly recurring price
      originalPrice: recommendation.originalPrice,
      category: 'Recommended Add-on',
      qty: recommendation.quantity || 1,
      
      // Proper pricing structure for cart calculations
      oneTimePrice: setupFee,
      unitPrice: {
        oneTime: setupFee,
        recurring: monthlyPrice
      },
      
      // Essential product details for display
      essentialDetails: recommendation.details,
      
      // Discount information
      hasDiscount: true,
      discountPercentage: recommendation.discount,
      discounts: [{
        type: 'volume',
        description: `${recommendation.discount}% off regular price`,
        amount: recommendation.originalPrice - recommendation.discountedPrice
      }],
      
      // Additional metadata for better cart display
      isRecommended: true,
      addedAt: new Date().toISOString(),
      icon: recommendation.icon
    };
    
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("products")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-all duration-200 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Cart Items Section - 8 columns */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Your Items ({allItems.length})
                </h2>
                <div className="space-y-4">
                {allItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                  >
                    {/* Discount Badge */}
                    {item.hasDiscount && (
                      <div className="absolute top-3 right-12 sm:top-4 sm:right-16 z-10">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          15% Off
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6 relative">
                      {/* Delete Button - Top Right */}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-200"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Product Header */}
                      <div className="flex gap-3 sm:gap-4 mb-4 pr-8 sm:pr-12">
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

                              // First try essentialDetails from template
                              if (item.essentialDetails && item.essentialDetails.length > 0) {
                                const displayDetails = item.essentialDetails.slice(0, 2);
                                displayDetails.forEach((detail, index) => {
                                  configs.push(
                                    <div
                                      key={`essential-${index}`}
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="text-slate-500">
                                        {detail.label}:
                                      </span>
                                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                        {detail.value}
                                      </span>
                                    </div>
                                  );
                                });
                              }

                              // If still need more configs, use selectedOptions
                              if (configs.length < 2) {
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
                              }

                              // If still no configs, try location and template name
                              if (configs.length < 2) {
                                if (item.templateName && configs.length < 2) {
                                  configs.push(
                                    <div
                                      key="template"
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="text-slate-500">
                                        Template:
                                      </span>
                                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                        {item.templateName}
                                      </span>
                                    </div>
                                  );
                                }
                                
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
                      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-end mb-4 gap-3 sm:gap-0">
                        {/* Pricing - Bottom Right */}
                        <div className="text-left sm:text-right">
                          <div className="text-sm text-slate-600">
                            One-time:{" "}
                            <span className="font-bold text-blue-600">
                              {fmt(item.totalPrice.oneTime)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            Monthly:{" "}
                            <span className="font-bold text-emerald-600">
                              {fmt(item.totalPrice.recurring)}
                            </span>
                          </div>
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
                            {/* Physical Specifications - Show all essentialDetails or selectedOptions */}
                            {((item.essentialDetails && item.essentialDetails.length > 0) ||
                              item.selectedOptions?.cabinetDimensions ||
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
                                  {/* Show essential details first */}
                                  {item.essentialDetails && item.essentialDetails.map((detail, index) => (
                                    <div key={`detail-${index}`} className="flex justify-between text-sm">
                                      <span className="text-slate-600 font-medium">
                                        {detail.label}:
                                      </span>
                                      <span className="text-slate-800 font-semibold">
                                        {detail.value}
                                      </span>
                                    </div>
                                  ))}

                                  {/* Fallback to selectedOptions if no essentialDetails */}
                                  {(!item.essentialDetails || item.essentialDetails.length === 0) && (
                                    <>
                                      {item.selectedOptions?.cabinetDimensions && (
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-600 font-medium">
                                            Cabinet Dimensions:
                                          </span>
                                          <span className="text-slate-800 font-semibold">
                                            {typeof item.selectedOptions.cabinetDimensions === 'object' 
                                              ? item.selectedOptions.cabinetDimensions.label || item.selectedOptions.cabinetDimensions
                                              : item.selectedOptions.cabinetDimensions}
                                          </span>
                                        </div>
                                      )}

                                      {item.selectedOptions?.drawCap && (
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-600 font-medium">
                                            Draw Cap:
                                          </span>
                                          <span className="text-slate-800 font-semibold">
                                            {typeof item.selectedOptions.drawCap === 'object' 
                                              ? item.selectedOptions.drawCap.label || item.selectedOptions.drawCap
                                              : item.selectedOptions.drawCap}
                                          </span>
                                        </div>
                                      )}

                                      {item.selectedOptions?.circuitType && (
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-600 font-medium">
                                            Circuit Type:
                                          </span>
                                          <span className="text-slate-800 font-semibold">
                                            {typeof item.selectedOptions.circuitType === 'object' 
                                              ? item.selectedOptions.circuitType.label || item.selectedOptions.circuitType
                                              : item.selectedOptions.circuitType}
                                          </span>
                                        </div>
                                      )}

                                      {item.selectedOptions?.pduQuantity && (
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-600 font-medium">
                                            PDU Quantity:
                                          </span>
                                          <span className="text-slate-800 font-semibold">
                                            {typeof item.selectedOptions.pduQuantity === 'object' 
                                              ? item.selectedOptions.pduQuantity.label || item.selectedOptions.pduQuantity
                                              : item.selectedOptions.pduQuantity}
                                          </span>
                                        </div>
                                      )}
                                    </>
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
            </div>

            {/* Order Summary Section - 4 columns */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6 lg:sticky lg:top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Order Summary
                  </h3>
                </div>
                <div className="space-y-6">
                  {/* Items Summary */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-600 font-medium">Cart Items</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                        {allItems.length}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {allItems.length === 1 ? '1 item' : `${allItems.length} items`} in your cart
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      Pricing Summary
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-lg">
                        <div>
                          <span className="text-slate-600 font-medium">One-time fee </span>
                          <div className="text-xs text-slate-500">Setup & Installation</div>
                        </div>
                        <span className="font-bold text-blue-600 text-lg">
                          {fmt(totals.oneTime)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-lg">
                        <div>
                          <span className="text-slate-600 font-medium">Monthly Recurring</span>
                          <div className="text-xs text-slate-500">Ongoing service costs</div>
                        </div>
                        <span className="font-bold text-emerald-600 text-lg">
                          {fmt(totals.recurring)}/mo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-slate-300 text-sm font-medium">Total Cost</div>
                        <div className="text-xs text-slate-400">First month + setup</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {fmt(totals.oneTime + totals.recurring)}
                        </div>
                        <div className="text-slate-300 text-sm">
                          Then {fmt(totals.recurring)}/month
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleGenerateQuote}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <FileText className="w-5 h-5" />
                      Generate Quote
                    </button>
                    
                    <button
                      onClick={() => navigate('products')}
                      className="w-full px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add More Items
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
