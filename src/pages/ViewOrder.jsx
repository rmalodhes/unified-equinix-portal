import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  Download,
  Eye,
  Check,
  Calendar,
  Clock,
  User,
  Building,
  Settings,
  AlertCircle,
  Truck,
  Package,
  MapPin,
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const ViewOrder = () => {
  const { orders, navigate } = useStore();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    // Get order ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    if (orderId) {
      // Try to find existing order or create mock order
      const existingOrder = orders.find((o) => o.id === orderId);

      if (existingOrder) {
        setCurrentOrder(existingOrder);
        setSelectedItems(new Set(existingOrder.items.map((_, index) => index)));
      } else {
        // Create mock order for demo purposes
        const mockOrder = {
          id: orderId,
          orderNumber: orderId,
          currency: "USD",
          deliveryDate: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: "processing",
          customerInfo: {
            name: "John Smith",
            email: "john.smith@company.com",
            company: "Tech Solutions Inc.",
            address: "123 Business Park, Suite 100, San Jose, CA 95110",
          },
          shippingInfo: {
            method: "Standard Delivery",
            trackingId: "TK" + Math.random().toString().substr(2, 9),
            carrier: "Equinix Logistics",
            estimatedDelivery: "14-21 business days",
          },
          items: [
            {
              id: Date.now(),
              name: "Secure Cabinet Express",
              category: "Colocation",
              key: "secure-cabinet",
              qty: 1,
              unitPrice: {
                oneTime: 500,
                recurring: 1260,
              },
              totalPrice: {
                oneTime: 500,
                recurring: 1260,
              },
              configuration: {
                cabinetDimensions: "600mm × 1200mm × 2200mm",
                circuitType: "Two Phase Circuit",
                drawCap: "3kVA",
                pduCount: 2,
                pdu: "PDU:P36E30G",
                ibx: "NY1",
                cage: "C-123",
                configuredAt: new Date().toISOString(),
              },
              needsConfiguration: false,
              configurationProgress: 100,
              type: "product",
              deliveryStatus: "In Transit",
            },
            {
              id: Date.now() + 1,
              name: "Ethernet Cross Connect",
              category: "Interconnection",
              key: "ethernet-cross-connect",
              qty: 2,
              unitPrice: {
                oneTime: 300,
                recurring: 150,
              },
              totalPrice: {
                oneTime: 600,
                recurring: 300,
              },
              configuration: {
                bandwidth: "1 Gbps",
                connector: "LC",
                vlan: "VLAN-2024",
                ibx: "NY1",
                cage: "C-123",
              },
              needsConfiguration: true,
              configurationProgress: 85,
              type: "product",
              deliveryStatus: "Preparing",
            },
          ],
        };

        setCurrentOrder(mockOrder);
        setSelectedItems(new Set(mockOrder.items.map((_, index) => index)));
      }
    }
  }, [orders]);

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
        const value = item.configuration[key];
        return `${key.replace(/([A-Z])/g, " $1").trim()}: ${value}`;
      }
    }
    return item.category || "Standard Configuration";
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Preparing":
        return "bg-yellow-100 text-yellow-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedItemsArray = currentOrder
    ? currentOrder.items.filter((_, index) => selectedItems.has(index))
    : [];

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-white/20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <ClipboardList className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">
              Order not found
            </h2>
            <p className="text-slate-500 mb-8">
              The requested order could not be located
            </p>
            <button
              onClick={() => navigate("orders")}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("orders")}
            className="flex items-center gap-2 text-slate-600 hover:text-green-600 mb-6 transition-all duration-200 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Order Overview Header */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    EQUINIX ORDER
                  </h1>
                  <p className="text-slate-600 mt-1 font-medium">
                    Order Number: {currentOrder.orderNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                    currentOrder.status === "pending"
                      ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200"
                      : currentOrder.status === "processing"
                      ? "bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 border border-blue-200"
                      : currentOrder.status === "completed"
                      ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200"
                      : currentOrder.status === "shipped"
                      ? "bg-gradient-to-r from-purple-100 to-purple-100 text-purple-800 border border-purple-200"
                      : "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {(currentOrder.status || "pending").charAt(0).toUpperCase() +
                    (currentOrder.status || "pending").slice(1)}
                </span>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border border-slate-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              </div>
            </div>

            {/* Order Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Ordered</p>
                  <p className="font-bold text-slate-800">
                    {currentOrder.createdAt
                      ? new Date(currentOrder.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Delivery</p>
                  <p className="font-bold text-slate-800">
                    {currentOrder.deliveryDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Customer</p>
                  <p className="font-bold text-slate-800">
                    {currentOrder.customerInfo?.name || "John Smith"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                  <Building className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Company</p>
                  <p className="font-bold text-slate-800">
                    {currentOrder.customerInfo?.company ||
                      "Tech Solutions Inc."}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/60 rounded-2xl border border-slate-200/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 font-medium">
                    Tracking ID:
                  </span>
                  <span className="ml-2 font-bold text-slate-800">
                    {currentOrder.shippingInfo?.trackingId || "TK123456789"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 font-medium">Carrier:</span>
                  <span className="ml-2 font-bold text-slate-800">
                    {currentOrder.shippingInfo?.carrier || "Equinix Logistics"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 font-medium">
                    Est. Delivery:
                  </span>
                  <span className="ml-2 font-bold text-slate-800">
                    {currentOrder.shippingInfo?.estimatedDelivery ||
                      "14-21 business days"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-[600px] bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Left Side Stepper */}
          <div className="w-80 bg-gradient-to-b from-white/90 to-slate-50/90 border-r border-slate-200/50">
            <div className="p-6 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-slate-800">
                Order Items ({currentOrder.items.length})
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Select items to view details
              </p>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Stepper Line */}
                    {index < currentOrder.items.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                    )}

                    {/* Item in Stepper */}
                    <div
                      onClick={() => handleItemSelection(index)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                        selectedItems.has(index)
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-md"
                          : "hover:bg-white/70 border border-slate-200 hover:border-green-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                          selectedItems.has(index)
                            ? "bg-gradient-to-br from-green-500 to-green-600 border-green-600 shadow-green-200"
                            : "border-slate-300 hover:border-green-400 bg-white"
                        }`}
                      >
                        {selectedItems.has(index) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>

                      {/* Step Number */}
                      <div
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                          selectedItems.has(index)
                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Product Name */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate font-medium">
                          {item.category}
                        </p>
                        {/* Delivery Status */}
                        <div className="mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDeliveryStatusColor(
                              item.deliveryStatus
                            )}`}
                          >
                            {item.deliveryStatus}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Status Icon */}
                      <div className="flex-shrink-0">
                        {item.deliveryStatus === "Delivered" ? (
                          <div className="p-1 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          </div>
                        ) : item.deliveryStatus === "In Transit" ? (
                          <div className="p-1 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full">
                            <Truck className="w-3 h-3 text-blue-600" />
                          </div>
                        ) : (
                          <div className="p-1 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full">
                            <Package className="w-3 h-3 text-orange-600" />
                          </div>
                        )}
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
                      currentOrder.items[Array.from(selectedItems)[0]];
                    return (
                      <>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            {/* Product Title */}
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                              {selectedItem.name}
                            </h2>

                            {/* First Attribute */}
                            <div className="text-slate-700 mb-4 font-medium">
                              {getFirstAttribute(selectedItem)}
                            </div>
                          </div>

                          {/* View Details Button on the right */}
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
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <Eye className="w-4 h-4" />
                            View Configuration
                          </button>
                        </div>

                        {/* Delivery Status */}
                        <div className="mb-6">
                          <div
                            className={`p-4 rounded-2xl border shadow-sm ${
                              selectedItem.deliveryStatus === "Delivered"
                                ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                                : selectedItem.deliveryStatus === "In Transit"
                                ? "bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200"
                                : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className={`p-1 rounded-full ${
                                  selectedItem.deliveryStatus === "Delivered"
                                    ? "bg-gradient-to-br from-emerald-500 to-green-500"
                                    : selectedItem.deliveryStatus ===
                                      "In Transit"
                                    ? "bg-gradient-to-br from-blue-500 to-blue-500"
                                    : "bg-gradient-to-br from-orange-500 to-amber-500"
                                }`}
                              >
                                {selectedItem.deliveryStatus === "Delivered" ? (
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                ) : selectedItem.deliveryStatus ===
                                  "In Transit" ? (
                                  <Truck className="w-4 h-4 text-white" />
                                ) : (
                                  <Package className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <h4
                                className={`font-bold ${
                                  selectedItem.deliveryStatus === "Delivered"
                                    ? "text-emerald-800"
                                    : selectedItem.deliveryStatus ===
                                      "In Transit"
                                    ? "text-blue-800"
                                    : "text-orange-800"
                                }`}
                              >
                                {selectedItem.deliveryStatus}
                              </h4>
                            </div>
                            <p
                              className={`text-sm font-medium ${
                                selectedItem.deliveryStatus === "Delivered"
                                  ? "text-emerald-700"
                                  : selectedItem.deliveryStatus === "In Transit"
                                  ? "text-blue-700"
                                  : "text-orange-700"
                              }`}
                            >
                              {selectedItem.deliveryStatus === "Delivered"
                                ? "This item has been successfully delivered and is ready for use."
                                : selectedItem.deliveryStatus === "In Transit"
                                ? "This item is currently being shipped to your location."
                                : "This item is being prepared for shipment."}
                            </p>
                          </div>
                        </div>

                        {/* Configuration Details */}
                        {selectedItem.configuration && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 shadow-sm mb-6">
                            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                              <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md">
                                <Settings className="w-3 h-3 text-white" />
                              </div>
                              Configuration Details
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(selectedItem.configuration).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="text-sm text-green-700 capitalize font-medium">
                                      {key.replace(/([A-Z])/g, " $1").trim()}:
                                    </span>
                                    <span className="text-sm text-green-900 font-bold">
                                      {value}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Detailed Pricing */}
                        <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/60 rounded-2xl p-5 border border-slate-200/50 shadow-inner mb-6">
                          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <div className="p-1 bg-gradient-to-br from-emerald-100 to-green-100 rounded-md">
                              <span className="text-emerald-600 text-xs">
                                $
                              </span>
                            </div>
                            Pricing Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-slate-600 font-medium">
                                  Quantity:
                                </span>
                                <span className="ml-2 font-bold text-slate-800">
                                  {selectedItem.qty}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-slate-600 font-medium">
                                  Unit of Measure:
                                </span>
                                <span className="ml-2 font-bold text-slate-800">
                                  Each
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-slate-300/50 pt-3 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600 font-medium">
                                  One-time Charge (NRC):
                                </span>
                                <span className="font-bold text-slate-800">
                                  {formatCurrency(
                                    selectedItem.unitPrice.oneTime
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600 font-medium">
                                  Monthly Recurring (MRC):
                                </span>
                                <span className="font-bold text-slate-800">
                                  {formatCurrency(
                                    selectedItem.unitPrice.recurring
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-slate-300/50 pt-4 space-y-3 bg-gradient-to-r from-white/50 to-slate-50/50 -m-1 p-4 rounded-xl">
                              <div className="flex justify-between">
                                <span className="font-bold text-slate-800">
                                  Total NRC:
                                </span>
                                <span className="font-bold text-blue-600 text-lg">
                                  {formatCurrency(
                                    selectedItem.totalPrice.oneTime
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-bold text-slate-800">
                                  Total MRC:
                                </span>
                                <span className="font-bold text-emerald-600 text-lg">
                                  {formatCurrency(
                                    selectedItem.totalPrice.recurring
                                  )}
                                  /mo
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 shadow-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-emerald-700 font-bold">
                                Order ID:
                              </span>
                              <span className="text-emerald-900 font-bold">
                                {currentOrder.id}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-emerald-700 font-bold">
                                Status:
                              </span>
                              <span className="text-emerald-900 capitalize font-bold">
                                {currentOrder.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-emerald-700 font-bold">
                                Tracking:
                              </span>
                              <span className="text-emerald-900 font-bold">
                                {currentOrder.shippingInfo?.trackingId ||
                                  "TK123456789"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  // Multiple items summary view
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Selected Items ({selectedItems.size})
                    </h2>
                    <div className="space-y-4">
                      {selectedItemsArray.map((item, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDeliveryStatusColor(
                                    item.deliveryStatus
                                  )}`}
                                >
                                  {item.deliveryStatus}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">
                                {getFirstAttribute(item)}
                              </p>

                              {/* Detailed Pricing */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    Qty: {item.qty} × NRC{" "}
                                    {formatCurrency(item.unitPrice.oneTime)}
                                  </span>
                                  <span className="font-medium text-blue-600">
                                    {formatCurrency(item.totalPrice.oneTime)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    Qty: {item.qty} × MRC{" "}
                                    {formatCurrency(item.unitPrice.recurring)}
                                  </span>
                                  <span className="font-medium text-green-600">
                                    {formatCurrency(item.totalPrice.recurring)}
                                    /mo
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                navigate(
                                  `/orderDetails?product=${
                                    item.key || item.id || item.name
                                  }&readonly=true`
                                )
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700 text-white font-medium text-sm cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              View Config
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <ClipboardList className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Select Order Items
                  </h3>
                  <p className="text-slate-500">
                    Choose items from the left to view detailed information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="mt-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-slate-500 to-slate-600 rounded-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            Shipping Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white/70 rounded-lg border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">
                Delivery Address
              </h4>
              <p className="text-slate-600">
                {currentOrder.customerInfo?.address ||
                  "123 Business Park, Suite 100, San Jose, CA 95110"}
              </p>
            </div>
            <div className="p-4 bg-white/70 rounded-lg border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">Shipping Method</h4>
              <p className="text-slate-600">
                {currentOrder.shippingInfo?.method || "Standard Delivery"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Est.{" "}
                {currentOrder.shippingInfo?.estimatedDelivery ||
                  "14-21 business days"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
