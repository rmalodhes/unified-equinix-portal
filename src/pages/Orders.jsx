import React from "react";
import { ArrowLeft, ClipboardList, Eye } from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const Orders = () => {
  const { orders, navigate } = useStore();

  const getStatusColor = (status = "pending") => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </button>
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-equinix-dark">Orders</h1>
        </div>
        <p className="text-gray-600 mt-2">Track your infrastructure orders</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12 p-6">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <div className="text-gray-500 text-lg mb-4">
              No orders created yet
            </div>
            <button onClick={() => navigate("quotes")} className="btn-primary">
              Generate Quotes
            </button>
          </div>
        ) : (
          <>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Order History ({orders.length})
              </h2>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Date Created
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Monthly Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className="font-mono text-sm font-medium text-blue-600">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </div>
                            <div className="text-gray-500 truncate max-w-xs">
                              {order.items.map((item) => item.name).join(", ")}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(order.total)}/mo
                          </span>
                          <div className="text-xs text-gray-500">
                            Annual: {formatCurrency(order.total * 12)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {orders.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      orders.reduce((sum, order) => sum + order.total, 0)
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Value</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(
                      orders.reduce((sum, order) => sum + order.total, 0) * 12
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Annual Value</div>
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
