import React from "react";
import { ArrowLeft, FileText, Eye, Download, Calendar } from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const Quotes = () => {
  const { navigate, quotes } = useStore();

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
            <FileText className="w-8 h-8 text-equinix-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          </div>
          <p className="text-gray-600 mt-2">Manage your quotes and proposals</p>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <div className="text-gray-500 text-xl mb-4">No quotes yet</div>
            <p className="text-gray-500 mb-6">
              Create your first quote by adding items to cart and generating a
              quote.
            </p>
            <button onClick={() => navigate("home")} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                All Quotes ({quotes.length})
              </h2>
            </div>

            {/* Quotes Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {quote.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(quote.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.items.length} item
                          {quote.items.length !== 1 ? "s" : ""}
                        </div>
                        <div className="text-xs text-gray-500">
                          {quote.items
                            .slice(0, 2)
                            .map((item) => item.name)
                            .join(", ")}
                          {quote.items.length > 2 &&
                            ` +${quote.items.length - 2} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(quote.total)}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            quote.status
                          )}`}
                        >
                          {quote.status.charAt(0).toUpperCase() +
                            quote.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/quoteDetails?id=${quote.id}`)
                          }
                          className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button className="inline-flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-3 h-3" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Total: {quotes.length} quote{quotes.length !== 1 ? "s" : ""}
                </div>
                <div className="text-sm text-gray-500">
                  Combined value:{" "}
                  {formatCurrency(
                    quotes.reduce((sum, quote) => sum + quote.total, 0)
                  )}
                  /month
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
