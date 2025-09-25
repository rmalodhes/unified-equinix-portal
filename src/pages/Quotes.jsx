import React, { useState } from "react";
import {
  Plus,
  FileText,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  Settings,
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const Quotes = () => {
  const { navigate, quotes, updateQuoteStatus } = useStore();
  const [activeTab, setActiveTab] = useState("all");

  const handleAcceptQuote = async (quoteId) => {
    try {
      await updateQuoteStatus(quoteId, "accepted", {
        signedBy: "John Smith",
        signedAt: new Date(),
        signedByEmail: "john.smith@company.com",
      });
      // Show success message or refresh data
      console.log(`Quote ${quoteId} accepted successfully`);
    } catch (error) {
      console.error("Failed to accept quote:", error);
      alert("Failed to accept quote. Please try again.");
    }
  };

  const getStatusColor = (status = "pending") => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Add mock configuration data for demo purposes, but preserve actual quote data
  const quotesWithMockData = quotes.map((quote) => ({
    ...quote,
    // Preserve the actual status from the store
    status: quote.status || "pending",
    items:
      quote.items?.map((item, index) => ({
        ...item,
        // Only add mock configuration data if not already present
        needsConfiguration:
          item.needsConfiguration !== undefined
            ? item.needsConfiguration
            : true,
        configurationProgress:
          item.configurationProgress !== undefined
            ? item.configurationProgress
            : index === 0
            ? 100
            : 0,
      })) || [],
  }));

  const filterQuotes = (quotes, tab) => {
    if (tab === "all") return quotes;
    return quotes.filter((quote) => quote.status === tab);
  };

  const getTabCount = (tab) => {
    return filterQuotes(quotesWithMockData, tab).length;
  };

  const filteredQuotes = filterQuotes(quotesWithMockData, activeTab);

  // Calculate totals for summary cards
  const totalQuoteValue = quotesWithMockData.reduce((sum, quote) => {
    const quoteTotal =
      (Array.isArray(quote.items) &&
        quote.items.reduce(
          (itemSum, item) =>
            itemSum + (item.totalPrice?.oneTime || item.price || 0),
          0
        )) ||
      quote.total ||
      0;
    return sum + quoteTotal;
  }, 0);

  const averageQuote = quotes.length > 0 ? totalQuoteValue / quotes.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Quotes
            </h1>
            <p className="text-slate-600">
              Manage your quotes, track status, and configure accepted orders.
            </p>
          </div>
          <button
            onClick={() => navigate("cart")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create New Quote
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-xl border border-white/20 shadow-sm">
            {[
              {
                key: "all",
                label: "All Quotes",
                count: quotesWithMockData.length,
              },
              {
                key: "pending",
                label: "Pending",
                count: getTabCount("pending"),
              },
              {
                key: "accepted",
                label: "Accepted",
                count: getTabCount("accepted"),
              },
              {
                key: "declined",
                label: "Declined",
                count: getTabCount("declined"),
              },
              {
                key: "expired",
                label: "Expired",
                count: getTabCount("expired"),
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-blue-600 hover:bg-white/80"
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

        {filteredQuotes.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-white/20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">
              No quotes found
            </h2>
            <p className="text-slate-500 mb-8">
              {activeTab === "all"
                ? "Create your first quote by adding items to cart and generating a quote."
                : `No ${activeTab} quotes found. Try switching to a different tab.`}
            </p>
            <button
              onClick={() => navigate("cart")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Quotes Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Quote
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Expires
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50">
                    {filteredQuotes.map((quote) => {
                      const quoteTotal =
                        (Array.isArray(quote.items) &&
                          quote.items.reduce(
                            (sum, item) =>
                              sum +
                              (item.totalPrice?.oneTime || item.price || 0),
                            0
                          )) ||
                        quote.total ||
                        0;
                      const monthlyTotal =
                        (Array.isArray(quote.items) &&
                          quote.items.reduce(
                            (sum, item) =>
                              sum + (item.totalPrice?.recurring || 0),
                            0
                          )) ||
                        0;

                      return (
                        <tr
                          key={quote.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-slate-900">
                                {quote.id}
                              </div>
                              <div className="text-sm text-slate-500">
                                {quote.items?.length || 0} item
                                {(quote.items?.length || 0) !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">
                                  {quote.customerInfo?.name || "John Smith"}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {quote.customerInfo?.company ||
                                    "Tech Solutions Inc."}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                quote.status
                              )}`}
                            >
                              {quote.status === "accepted" && (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              {(quote.status || "pending")
                                .charAt(0)
                                .toUpperCase() +
                                (quote.status || "pending").slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              {new Date(quote.createdAt).toLocaleDateString(
                                "en-GB"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600">
                              {quote.validUntil ||
                                new Date(
                                  Date.now() + 30 * 24 * 60 * 60 * 1000
                                ).toLocaleDateString("en-GB")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-slate-900">
                                {formatCurrency(quoteTotal)}
                              </div>
                              {monthlyTotal > 0 && (
                                <div className="text-sm text-slate-500">
                                  {formatCurrency(monthlyTotal)}/mo
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/quoteDetails?id=${quote.id}`)
                                }
                                className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg hover:bg-blue-50/50 transition-colors text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                View Quote
                              </button>
                              {quote.status === "pending" && (
                                <button
                                  onClick={() => handleAcceptQuote(quote.id)}
                                  className="flex items-center gap-1 px-3 py-2 text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Accept
                                </button>
                              )}
                              {quote.status === "accepted" &&
                                (() => {
                                  // Calculate configuration metrics
                                  const configurableItems = (
                                    quote.items || []
                                  ).filter((item) => item.needsConfiguration);
                                  const unconfiguredItems =
                                    configurableItems.filter(
                                      (item) =>
                                        (item.configurationProgress || 0) < 100
                                    );
                                  const configuredItems =
                                    configurableItems.filter(
                                      (item) =>
                                        (item.configurationProgress || 0) ===
                                        100
                                    );

                                  const totalConfigurable =
                                    configurableItems.length;
                                  const totalConfigured =
                                    configuredItems.length;
                                  const configCount = unconfiguredItems.length;

                                  // If all items are configured, show progress instead of configure button - styled to match QuoteDetails
                                  if (
                                    totalConfigurable > 0 &&
                                    configCount === 0
                                  ) {
                                    return (
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <span className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-sm bg-emerald-100 text-emerald-800 border border-emerald-500">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>
                                              Configured ({totalConfigured}/
                                              {totalConfigurable})
                                            </span>
                                          </span>
                                        </div>
                                        <div className="w-full bg-emerald-200 rounded-full h-1.5">
                                          <div className="bg-emerald-600 h-1.5 rounded-full w-full"></div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  // Show configure button with configured/total format and progress bar
                                  return (
                                    <div className="flex flex-col gap-1">
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/quoteDetails?id=${quote.id}`
                                          )
                                        }
                                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                      >
                                        <Settings className="w-4 h-4" />
                                        <span>
                                          Configure ({totalConfigured}/
                                          {totalConfigurable})
                                        </span>
                                      </button>
                                      {totalConfigurable > 0 && (
                                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                                          <div
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                              totalConfigured ===
                                              totalConfigurable
                                                ? "bg-emerald-500"
                                                : totalConfigured > 0
                                                ? "bg-yellow-500"
                                                : "bg-red-400"
                                            }`}
                                            style={{
                                              width: `${Math.max(
                                                8,
                                                (totalConfigured /
                                                  totalConfigurable) *
                                                  100
                                              )}%`,
                                            }}
                                          ></div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                            </div>
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
                  Total Quote Value
                </h3>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(totalQuoteValue)}
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Total Savings
                </h3>
                <div className="text-3xl font-bold text-green-600">$0</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Average Quote
                </h3>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(averageQuote)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quotes;
