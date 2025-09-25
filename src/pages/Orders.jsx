import React, { useState } from "react";
import {
  Plus,
  ClipboardList,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  Truck,
  MapPin,
  Clock,
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const Orders = () => {
  const { orders, navigate } = useStore();
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status = "pending") => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterOrders = (orders, tab) => {
    if (tab === "all") return orders;
    return orders.filter((order) => order.status === tab);
  };

  const getTabCount = (tab) => {
    return filterOrders(orders, tab).length;
  };

  const filteredOrders = filterOrders(orders, activeTab);

  // Calculate totals for summary cards
  const totalOrderValue = orders.reduce((sum, order) => {
    const orderTotal =
      (Array.isArray(order.items) &&
        order.items.reduce(
          (itemSum, item) =>
            itemSum + (item.totalPrice?.oneTime || item.price || 0),
          0
        )) ||
      order.total ||
      0;
    return sum + orderTotal;
  }, 0);

  const totalMonthlyValue = orders.reduce((sum, order) => {
    const monthlyTotal =
      (Array.isArray(order.items) &&
        order.items.reduce(
          (itemSum, item) => itemSum + (item.totalPrice?.recurring || 0),
          0
        )) ||
      0;
    return sum + monthlyTotal;
  }, 0);

  const averageOrder = orders.length > 0 ? totalOrderValue / orders.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Orders
            </h1>
            <p className="text-slate-600">
              Track your infrastructure orders and delivery status.
            </p>
          </div>
          <button
            onClick={() => navigate("quotes")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create New Order
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-xl border border-white/20 shadow-sm">
            {[
              { key: "all", label: "All Orders", count: orders.length },
              {
                key: "pending",
                label: "Pending",
                count: getTabCount("pending"),
              },
              {
                key: "processing",
                label: "Processing",
                count: getTabCount("processing"),
              },
              {
                key: "shipped",
                label: "Shipped",
                count: getTabCount("shipped"),
              },
              {
                key: "completed",
                label: "Completed",
                count: getTabCount("completed"),
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-green-600 hover:bg-white/80"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-white/20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <ClipboardList className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">
              No orders found
            </h2>
            <p className="text-slate-500 mb-8">
              {activeTab === "all"
                ? "Create your first order by generating quotes and accepting them."
                : `No ${activeTab} orders found. Try switching to a different tab.`}
            </p>
            <button
              onClick={() => navigate("quotes")}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View Quotes
            </button>
          </div>
        ) : (
          <>
            {/* Orders Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Order Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Location (IBX)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Est. Completion
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50">
                    {filteredOrders.map((order) => {
                      // Get primary product name (first item or summary)
                      const primaryProduct =
                        order.items?.length > 0
                          ? order.items[0].name
                          : order.configurationSummary ||
                            "Infrastructure Service";

                      // Get location from configuration or default
                      const location =
                        order.items?.[0]?.configurationData?.location ||
                        order.items?.[0]?.configuration?.ibx ||
                        order.location ||
                        "SV1";

                      // Calculate estimated completion date (30 days from creation for demo)
                      const estimatedCompletion = new Date(
                        new Date(order.createdAt).getTime() +
                          30 * 24 * 60 * 60 * 1000
                      );

                      // Last updated date (use createdAt or a mock recent date)
                      const lastUpdated = order.updatedAt || order.createdAt;

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Order Number */}
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">
                              {order.orderNumber || order.id}
                            </div>
                          </td>

                          {/* Product */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-slate-900">
                                {primaryProduct}
                              </div>
                              {order.items?.length > 1 && (
                                <div className="text-sm text-slate-500">
                                  +{order.items.length - 1} more item
                                  {order.items.length - 1 !== 1 ? "s" : ""}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Location (IBX) */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="font-medium">
                                {location.toUpperCase()}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status === "completed" && (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              {order.status === "shipped" && (
                                <Truck className="w-3 h-3 mr-1" />
                              )}
                              {(order.status || "pending")
                                .charAt(0)
                                .toUpperCase() +
                                (order.status || "pending").slice(1)}
                            </span>
                          </td>

                          {/* Estimated Completion Date */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              {estimatedCompletion.toLocaleDateString("en-GB")}
                            </div>
                          </td>

                          {/* Last Updated */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4" />
                              {new Date(lastUpdated).toLocaleDateString(
                                "en-GB"
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                navigate(`/viewOrder?id=${order.id}`)
                              }
                              className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-green-600 border border-slate-200 hover:border-green-300 rounded-lg hover:bg-green-50/50 transition-colors text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Order
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Total Order Value
                </h3>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(totalOrderValue)}
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Monthly Recurring
                </h3>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalMonthlyValue)}
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Average Order
                </h3>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(averageOrder)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
