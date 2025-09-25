import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";
import {
  CheckCircle2,
  Calendar,
  User,
  Building,
  FileText,
  Settings,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function QuoteOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { quotes, updateQuoteStatus, clearCart } = useStore();
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (id) {
      const foundQuote = quotes.find((q) => q.id === id);
      if (foundQuote) {
        setQuote(foundQuote);
      } else {
        // Create mock quote if not found (for demo purposes)
        const mockQuote = {
          id: id,
          quoteNumber: `QUOTE-${id}`,
          currency: "USD",
          validUntil: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "pending",
          customerInfo: {
            name: "John Smith",
            email: "john.smith@company.com",
            company: "Tech Solutions Inc.",
          },
          initialTermMonths: 24,
          renewalPeriodMonths: 12,
          nonRenewalNotice: 90,
          items: [
            {
              id: Date.now(),
              product: {
                id: "secure-cabinet",
                name: "Secure Cabinet Express",
                category: "Colocation",
                configurationRequired: true,
                configurationScope: "per-line-item",
              },
              qty: 1,
              unitPrice: {
                oneTime: 500,
                recurring: 1260,
              },
              totalPrice: {
                oneTime: 500,
                recurring: 1260,
              },
              selectedOptions: {
                cabinetDimensions: { label: "600mm × 1200mm × 2200mm" },
                circuitType: { label: "Two Phase Circuit" },
                drawCap: { label: "3kVA" },
                pduCount: { label: "2" },
              },
              configuration: {
                status: "not-started",
                completedCount: 0,
                totalRequired: 1,
              },
            },
            {
              id: Date.now() + 1,
              product: {
                id: "ethernet-cross-connect",
                name: "Ethernet Cross Connect",
                category: "Interconnection",
                configurationRequired: true,
                configurationScope: "per-quantity",
              },
              qty: 2,
              unitPrice: {
                oneTime: 300,
                recurring: 150,
              },
              totalPrice: {
                oneTime: 600,
                recurring: 300,
              },
              selectedOptions: {
                bandwidth: { label: "1 Gbps" },
                connectionType: { label: "Single Mode Fiber" },
              },
              configuration: {
                status: "partial",
                completedCount: 1,
                totalRequired: 2,
              },
            },
          ],
          finalTotals: {
            oneTime: 1100,
            recurring: 1560,
          },
          originalTotals: {
            oneTime: 1100,
            recurring: 1560,
          },
          totalSavings: 0,
          discounts: {
            appliedDiscounts: [],
          },
        };
        setQuote(mockQuote);
      }
    }
    setIsLoading(false);
  }, [id, quotes]);

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
      setTimeout(() => setMessage(null), 5000);
    }
  }, [location.state]);

  const fmt = (v) => formatCurrency(v);

  const toggleItemExpansion = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Helper function to get discounts for a specific item
  const getItemDiscounts = (item) => {
    if (!quote) return [];
    const itemKey =
      item.product.id +
      (item.selectedOptions ? JSON.stringify(item.selectedOptions) : "");
    return quote.discounts.appliedDiscounts.filter(
      (discount) => discount.cartItemKey === itemKey
    );
  };

  // Helper function to calculate original price before discounts
  const getOriginalItemPrice = (item) => {
    const itemDiscounts = getItemDiscounts(item);
    const oneTimeDiscount = itemDiscounts
      .filter((d) => d.pricingComponent === "oneTime")
      .reduce((sum, d) => sum + d.discountAmount, 0);
    const recurringDiscount = itemDiscounts
      .filter((d) => d.pricingComponent === "recurring")
      .reduce((sum, d) => sum + d.discountAmount, 0);

    return {
      oneTime: item.totalPrice.oneTime + oneTimeDiscount,
      recurring: item.totalPrice.recurring + recurringDiscount,
    };
  };

  const handleAcceptQuote = async () => {
    if (!quote) return;

    setIsAccepting(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Update quote status with electronic signature
      updateQuoteStatus(quote.id, "accepted", {
        signedBy: "John Smith",
        signedAt: new Date(),
        signedByEmail: "john.smith@company.com",
      });

      // Clear the cart since quote is accepted
      if (clearCart) clearCart();

      navigate("/quotes", {
        state: {
          message: `Quote ${quote.quoteNumber} accepted successfully! You can now configure your products.`,
        },
      });
    } catch (error) {
      console.error("Failed to accept quote:", error);
      alert("Failed to accept quote. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineQuote = async () => {
    if (!quote) return;

    setIsDeclining(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      updateQuoteStatus(quote.id, "declined", {
        signedBy: "John Smith",
        signedAt: new Date(),
        signedByEmail: "john.smith@company.com",
      });
      navigate("/quotes", {
        state: { message: "Quote declined." },
      });
    } catch (error) {
      console.error("Failed to decline quote:", error);
      alert("Failed to decline quote. Please try again.");
    } finally {
      setIsDeclining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Quote Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The requested quote could not be found.
          </p>
          <button
            onClick={() => navigate("/quotes")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }

  const isExpired = quote.status === "expired" || quote.expiresAt < new Date();
  const canAccept = quote.status === "pending" && !isExpired;
  const canDecline = quote.status === "pending" && !isExpired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate("/quotes")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                My Quotes
              </button>
              <span className="text-slate-500">›</span>
              <span className="text-slate-800">{quote.quoteNumber}</span>
            </nav>

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mt-4 shadow-sm animate-in slide-in-from-top-1 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 text-xl">✅</span>
                    <span className="font-medium">{message}</span>
                  </div>
                  <button
                    onClick={() => setMessage(null)}
                    className="text-green-800 hover:text-green-900 opacity-70 hover:opacity-100 transition-opacity"
                    title="Dismiss message"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/quote/${quote.id}/document`)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center space-x-2 font-medium"
                title="View quote as PDF document"
              >
                <span>📄</span>
                <span>View Document</span>
              </button>

              {canDecline && (
                <button
                  onClick={handleDeclineQuote}
                  disabled={isDeclining}
                  className={`px-6 py-2 border rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isDeclining
                      ? "border-slate-300 text-slate-500 bg-slate-100 cursor-not-allowed"
                      : "border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                  }`}
                  title={
                    isDeclining ? "Declining quote..." : "Decline this quote"
                  }
                >
                  {isDeclining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Declining...</span>
                    </>
                  ) : (
                    <>
                      <span>❌</span>
                      <span>Decline Quote</span>
                    </>
                  )}
                </button>
              )}

              {canAccept && (
                <button
                  onClick={handleAcceptQuote}
                  disabled={isAccepting}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm ${
                    isAccepting
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                  }`}
                  title={
                    isAccepting
                      ? "Processing acceptance..."
                      : "Accept this quote and create an order"
                  }
                >
                  {isAccepting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Accept Quote</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {quote.quoteNumber}
              </h1>
              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <span>
                  Created {new Date(quote.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className={isExpired ? "text-red-600" : ""}>
                  Expires {new Date(quote.expiresAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quote.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : quote.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : quote.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Quote Total</p>
                <p className="text-3xl font-bold text-blue-600">
                  {fmt(quote.finalTotals?.oneTime)}
                </p>
                <p className="text-xs text-blue-600">One-time charges</p>
                {quote.finalTotals?.recurring > 0 && (
                  <>
                    <p className="text-xl font-semibold text-blue-600 mt-2">
                      {fmt(quote.finalTotals?.recurring)}/month
                    </p>
                    <p className="text-xs text-blue-600">Monthly charges</p>
                  </>
                )}
                {quote.totalSavings > 0 && (
                  <div className="mt-3 text-sm text-green-600 flex items-center justify-center space-x-1">
                    <span>💰</span>
                    <span>Discounts applied</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20">
            <h3 className="font-semibold text-slate-800 mb-3">
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-600">Name:</span>{" "}
                {quote.customerInfo.name}
              </p>
              <p>
                <span className="text-slate-600">Email:</span>{" "}
                {quote.customerInfo.email}
              </p>
              <p>
                <span className="text-slate-600">Company:</span>{" "}
                {quote.customerInfo.company}
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20">
            <h3 className="font-semibold text-slate-800 mb-3">Quote Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-600">Currency:</span>{" "}
                {quote.currency}
              </p>
              <p>
                <span className="text-slate-600">Valid Until:</span>{" "}
                {quote.validUntil}
              </p>
              <p>
                <span className="text-slate-600">Items:</span>{" "}
                {quote.items.length}
              </p>
            </div>
          </div>

          {quote.initialTermMonths && (
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20">
              <h3 className="font-semibold text-slate-800 mb-3">
                Contract Terms
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Initial Term:</span>{" "}
                  {quote.initialTermMonths} months
                </p>
                <p>
                  <span className="text-slate-600">Renewal:</span>{" "}
                  {quote.renewalPeriodMonths} months
                </p>
                <p>
                  <span className="text-slate-600">Notice Period:</span>{" "}
                  {quote.nonRenewalNotice} days
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Overview - only show for accepted quotes */}
        {quote.status === "accepted" &&
          (() => {
            // Calculate configuration metrics
            const configurableItems = quote.items.filter(
              (item) => item.product.configurationRequired
            );

            const totalInstances = configurableItems.reduce((sum, item) => {
              const configScope =
                item.product.configurationScope || "per-line-item";
              return sum + (configScope === "per-quantity" ? item.qty : 1);
            }, 0);

            const configuredInstances = configurableItems.reduce(
              (sum, item) => {
                const completedCount = item.configuration?.completedCount || 0;
                return sum + completedCount;
              },
              0
            );

            const partialProducts = configurableItems.filter(
              (item) => item.configuration?.status === "partial"
            ).length;

            if (totalInstances > 0) {
              return (
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 mb-8">
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Configuration Progress
                      </h3>
                      <div className="text-sm text-slate-600">
                        {configuredInstances} of {totalInstances} instances
                        configured
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-4 mb-4 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out relative"
                        style={{
                          width: `${
                            totalInstances > 0
                              ? (configuredInstances / totalInstances) * 100
                              : 0
                          }%`,
                        }}
                      >
                        {configuredInstances > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                        )}
                      </div>
                      {totalInstances > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-800">
                          {Math.round(
                            (configuredInstances / totalInstances) * 100
                          )}
                          %
                        </div>
                      )}
                    </div>

                    {/* Status Summary */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-green-600 font-semibold text-lg">
                          {configuredInstances}
                        </div>
                        <div className="text-slate-600">Configured</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-600 font-semibold text-lg">
                          {partialProducts}
                        </div>
                        <div className="text-slate-600">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-600 font-semibold text-lg">
                          {totalInstances - configuredInstances}
                        </div>
                        <div className="text-slate-600">Pending</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-6">
                    <h4 className="font-medium text-slate-800 mb-3">
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      {configurableItems
                        .filter(
                          (item) =>
                            !item.configuration ||
                            item.configuration.status !== "complete"
                        )
                        .map((item) => {
                          const originalIndex = quote.items.findIndex(
                            (origItem) => origItem === item
                          );
                          const lineItemId = `${quote.id}_item_${originalIndex}`;

                          return (
                            <div
                              key={originalIndex}
                              className="flex items-center justify-between py-3 px-4 bg-slate-100 rounded-lg border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    item.configuration?.status === "complete"
                                      ? "bg-green-500"
                                      : item.configuration?.status === "partial"
                                      ? "bg-yellow-500"
                                      : "bg-slate-400"
                                  }`}
                                ></div>
                                <span className="font-medium text-slate-800">
                                  {item.product.name}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    item.configuration?.status === "complete"
                                      ? "bg-green-100 text-green-800"
                                      : item.configuration?.status === "partial"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-slate-200 text-slate-600"
                                  }`}
                                >
                                  {item.configuration?.status === "complete"
                                    ? "Configured"
                                    : item.configuration?.status === "partial"
                                    ? "In Progress"
                                    : "Not Started"}
                                </span>
                                {item.qty > 1 && (
                                  <span className="text-xs text-slate-600 bg-white px-2 py-1 rounded-full">
                                    {item.configuration?.completedCount || 0}/
                                    {item.qty}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/quotes/${quote.id}/configure/${lineItemId}`
                                  )
                                }
                                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                  item.configuration?.status === "complete"
                                    ? "bg-green-100 text-green-800 hover:bg-green-500 hover:text-white border border-green-500"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                                title={
                                  item.configuration?.status === "complete"
                                    ? "Review or modify configuration"
                                    : "Configure this product"
                                }
                              >
                                <span>
                                  {item.configuration?.status === "complete"
                                    ? "⚙️"
                                    : "🔧"}
                                </span>
                                <span>
                                  {item.configuration?.status === "complete"
                                    ? "Reconfigure"
                                    : "Configure"}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

        {/* Quote Items */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Quote Items</h2>

          {quote.items.map((item, index) => {
            const itemDiscounts = getItemDiscounts(item);
            const originalPrice = getOriginalItemPrice(item);
            const hasDiscounts = itemDiscounts.length > 0;

            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden"
              >
                {/* Discount Badge */}
                {hasDiscounts && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200 flex items-center space-x-1">
                      <span>💰</span>
                      <span>Savings Applied</span>
                    </div>
                  </div>
                )}

                {/* Item Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-50 transition-colors relative"
                  onClick={() => toggleItemExpansion(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {item.product.name}
                        </h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {item.product.category}
                        </span>

                        {/* Configuration Status - show for all configurable products */}
                        {item.product.configurationRequired &&
                          quote.status === "accepted" && (
                            <div className="flex items-center space-x-2">
                              {item.configuration?.status === "complete" ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  <span>
                                    {item.qty > 1
                                      ? `${item.configuration.completedCount}/${item.configuration.totalRequired} Configured`
                                      : "Configured"}
                                  </span>
                                </span>
                              ) : item.configuration?.status === "partial" ? (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                  <span>
                                    {item.qty > 1
                                      ? `${item.configuration.completedCount}/${item.configuration.totalRequired} Configured`
                                      : "In Progress"}
                                  </span>
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                  <span>
                                    {item.qty > 1
                                      ? `0/${item.qty} Configured`
                                      : "Configuration Required"}
                                  </span>
                                </span>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const lineItemId = `${quote.id}_item_${index}`;
                                  navigate(
                                    `/quotes/${quote.id}/configure/${lineItemId}`
                                  );
                                }}
                                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm ${
                                  item.configuration?.status === "complete"
                                    ? "bg-green-100 text-green-800 hover:bg-green-500 hover:text-white border border-green-500"
                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                                }`}
                                title={
                                  item.configuration?.status === "complete"
                                    ? "Product configured - click to review or modify configuration"
                                    : `Configure ${item.product.name}${
                                        item.qty > 1 &&
                                        item.configuration?.completedCount
                                          ? ` (${
                                              item.qty -
                                              item.configuration.completedCount
                                            } remaining)`
                                          : ""
                                      }`
                                }
                              >
                                <span>
                                  {item.configuration?.status === "complete"
                                    ? "⚙️"
                                    : "🔧"}
                                </span>
                                <span>
                                  {item.configuration?.status === "complete"
                                    ? "Reconfigure"
                                    : item.qty > 1 &&
                                      item.configuration?.completedCount
                                    ? `Configure (${
                                        item.qty -
                                        item.configuration.completedCount
                                      } remaining)`
                                    : "Configure"}
                                </span>
                              </button>
                            </div>
                          )}
                      </div>
                      <div className="mt-2 flex items-center space-x-6 text-sm text-slate-600">
                        <span>Quantity: {item.qty}</span>
                        {item.selectedOptions &&
                          Object.keys(item.selectedOptions).length > 0 && (
                            <span>
                              • {Object.keys(item.selectedOptions).length}{" "}
                              configuration
                              {Object.keys(item.selectedOptions).length !== 1
                                ? "s"
                                : ""}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="text-right">
                      {hasDiscounts ? (
                        <div>
                          <div className="text-lg font-semibold text-green-600">
                            {fmt(item.totalPrice.oneTime)}
                          </div>
                          <div className="text-xs text-slate-600 line-through">
                            {fmt(originalPrice.oneTime)}
                          </div>
                          {item.totalPrice.recurring > 0 && (
                            <div className="mt-1">
                              <div className="text-sm font-semibold text-green-600">
                                {fmt(item.totalPrice.recurring)}/month
                              </div>
                              {originalPrice.recurring >
                                item.totalPrice.recurring && (
                                <div className="text-xs text-slate-600 line-through">
                                  {fmt(originalPrice.recurring)}/month
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="text-lg font-semibold text-slate-800">
                            {fmt(item.totalPrice.oneTime)}
                          </div>
                          {item.totalPrice.recurring > 0 && (
                            <div className="text-sm text-slate-600">
                              {fmt(item.totalPrice.recurring)}/month
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <span
                        className={`transition-transform ${
                          expandedItems.has(index) ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Item Details */}
                {expandedItems.has(index) && (
                  <div className="border-t bg-slate-50">
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Configuration Details */}
                        {item.selectedOptions &&
                          Object.keys(item.selectedOptions).length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-3">
                                Configuration
                              </h4>
                              <div className="space-y-2">
                                {Object.entries(item.selectedOptions).map(
                                  ([key, option]) => (
                                    <div
                                      key={key}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-slate-600">
                                        {key
                                          .replace("__", "")
                                          .replace(/([A-Z])/g, " $1")
                                          .trim()}
                                        :
                                      </span>
                                      <span className="text-slate-800 font-medium">
                                        {option.label}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Pricing Breakdown */}
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-3">
                            Pricing Breakdown
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Unit Price (One-time):
                              </span>
                              <span className="text-slate-800">
                                {fmt(item.unitPrice.oneTime)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Unit Price (Monthly):
                              </span>
                              <span className="text-slate-800">
                                {fmt(item.unitPrice.recurring)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Quantity:</span>
                              <span className="text-slate-800">{item.qty}</span>
                            </div>

                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between text-sm font-semibold">
                                <span className="text-slate-800">
                                  Final One-time:
                                </span>
                                <span className="text-slate-800">
                                  {fmt(item.totalPrice.oneTime)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className="text-slate-800">
                                  Final Monthly:
                                </span>
                                <span className="text-slate-800">
                                  {fmt(item.totalPrice.recurring)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pricing Summary */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Pricing Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">One-time charges:</span>
                <span className="font-semibold text-slate-800">
                  {fmt(quote.finalTotals?.oneTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Monthly recurring charges:
                </span>
                <span className="font-semibold text-slate-800">
                  {fmt(quote.finalTotals?.recurring)}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
                <p className="text-sm text-blue-700 mb-2">Grand Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {fmt(quote.finalTotals?.oneTime)}
                </p>
                {quote.finalTotals.recurring > 0 && (
                  <p className="text-lg font-semibold text-blue-600">
                    {fmt(quote.finalTotals?.recurring)}/month
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Message for non-pending quotes */}
        {quote.status !== "pending" && (
          <div
            className={`mt-8 p-6 rounded-xl text-center ${
              quote.status === "accepted"
                ? "bg-green-50 border border-green-200"
                : quote.status === "declined"
                ? "bg-red-50 border border-red-200"
                : "bg-slate-100 border border-slate-200"
            }`}
          >
            <div
              className={`text-lg font-semibold mb-2 ${
                quote.status === "accepted"
                  ? "text-green-800"
                  : quote.status === "declined"
                  ? "text-red-800"
                  : "text-slate-800"
              }`}
            >
              Quote{" "}
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </div>
            {quote.status === "accepted" && (
              <p className="text-green-700">
                This quote has been accepted and an order has been created. You
                can now configure your products.
              </p>
            )}
            {quote.status === "declined" && (
              <p className="text-red-700">
                This quote has been declined. You can create a new quote by
                adding items to your cart.
              </p>
            )}
            {quote.status === "expired" && (
              <p className="text-slate-600">
                This quote has expired. Please create a new quote with updated
                pricing.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
