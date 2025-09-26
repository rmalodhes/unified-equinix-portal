import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FileText,
  ShoppingCart,
  CheckCircle2,
  Settings,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const QuoteDetails = () => {
  const { quotes, navigate, createOrder, updateQuoteStatus, addQuote } =
    useStore();
  const location = useLocation();
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [message, setMessage] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Function to start configuration for an item
  const handleStartConfiguration = (itemIndex) => {
    if (!currentQuote) return;

    const item = currentQuote.items[itemIndex];

    // Check if configuration is required using the same robust check
    const requiresConfiguration =
      item.product?.configurationRequired ||
      item.needsConfiguration ||
      item.configurationProgress !== undefined ||
      item.configurationStatus ||
      (item.key && ['secure-cabinet', 'ethernet-cross-connect', 'cross-connect'].includes(item.key)) ||
      (item.name && item.name.toLowerCase().includes('cross connect'));

    if (requiresConfiguration) {
      // Navigate to configuration page
      navigate(`/configuration/${currentQuote.id}/${itemIndex}`);
    } else {
      console.warn("Item does not require configuration:", item);
      alert("This item does not require configuration.");
    }
  };

  // Helper functions
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

  const getItemDiscounts = (item) => {
    if (!currentQuote) return [];
    // For now, return empty array - can be enhanced later
    return [];
  };

  const getOriginalItemPrice = (item) => {
    const itemDiscounts = getItemDiscounts(item);
    return {
      oneTime: item.totalPrice.oneTime,
      recurring: item.totalPrice.recurring,
    };
  };

  useEffect(() => {
    // Get quote ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get("id");

    if (quoteId) {
      // Try to find existing quote or create mock quote
      const existingQuote = quotes.find((q) => q.id === quoteId);

      if (existingQuote) {
        // Always update with the latest quote data from the store
        // This ensures configuration progress updates are reflected when returning from configuration page
        setCurrentQuote(existingQuote);
      } else {
        // Create mock quote for demo purposes
        const mockQuote = {
          id: quoteId,
          quoteNumber: quoteId,
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
                status: "complete",
                completedCount: 1,
                totalRequired: 1,
              },
              needsConfiguration: true,
              configurationProgress: 100,
              configurationStatus: "complete",
              type: "product",
              product: {
                id: "secure-cabinet",
                name: "Secure Cabinet Express",
                category: "Colocation",
                configurationRequired: true,
                configurationScope: "per-line-item",
              },
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
                connectionType: "Single Mode Fiber",
                ibx: "NY1",
                status: "partial",
                completedCount: 1,
                totalRequired: 2,
              },
              needsConfiguration: true,
              configurationProgress: 50,
              configurationStatus: "partial",
              type: "product",
              product: {
                id: "ethernet-cross-connect",
                name: "Ethernet Cross Connect",
                category: "Interconnection",
                configurationRequired: true,
                configurationScope: "per-quantity",
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

        // Add the mock quote to the store so Configuration component can find it
        // Only add if it doesn't already exist in the store
        const quoteExistsInStore = quotes.some((q) => q.id === quoteId);
        if (!quoteExistsInStore) {
          addQuote(mockQuote);
        }

        setCurrentQuote(mockQuote);
      }
    }
    setIsLoading(false);
  }, [quotes, addQuote]);

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
      setTimeout(() => setMessage(null), 5000);
    }
  }, [location]);

  const handleAcceptQuote = async () => {
    if (!currentQuote) return;

    setIsAccepting(true);

    try {
      await updateQuoteStatus(currentQuote.id, "accepted", {
        signedBy: "John Smith",
        signedAt: new Date(),
        signedByEmail: "john.smith@company.com",
      });

      // Update local state
      setCurrentQuote((prev) => ({ ...prev, status: "accepted" }));

      alert(
        `Quote ${currentQuote.quoteNumber} accepted successfully! You can now configure your products.`
      );
    } catch (error) {
      console.error("Failed to accept quote:", error);
      alert("Failed to accept quote. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineQuote = async () => {
    if (!currentQuote) return;

    setIsDeclining(true);

    try {
      await updateQuoteStatus(currentQuote.id, "declined", {
        signedBy: "John Smith",
        signedAt: new Date(),
        signedByEmail: "john.smith@company.com",
      });

      alert("Quote declined.");
      navigate("quotes");
    } catch (error) {
      console.error("Failed to decline quote:", error);
      alert("Failed to decline quote. Please try again.");
    } finally {
      setIsDeclining(false);
    }
  };

  const handleCreateOrder = () => {
    if (!currentQuote) return;

    // Check if quote is accepted
    if (currentQuote.status !== "accepted") {
      alert("Quote must be accepted before creating an order.");
      return;
    }

    // Check if all configurable items are configured
    const configurableItems = currentQuote.items.filter((item) => {
      return (
        item.product?.configurationRequired || 
        item.needsConfiguration ||
        item.configurationProgress !== undefined ||
        item.configurationStatus ||
        (item.key && ['secure-cabinet', 'ethernet-cross-connect', 'cross-connect'].includes(item.key)) ||
        (item.name && item.name.toLowerCase().includes('cross connect'))
      );
    });
    const unconfiguredItems = configurableItems.filter(
      (item) => item.configurationProgress < 100
    );

    if (unconfiguredItems.length > 0) {
      alert(
        `Please complete configuration for: ${unconfiguredItems
          .map((item) => item.name)
          .join(", ")}`
      );
      return;
    }

    const orderId = `1-${Math.random().toString().substr(2, 9)}`;

    const order = {
      id: orderId,
      quoteId: currentQuote.id,
      items: currentQuote.items, // Include all items
      total: currentQuote.items.reduce(
        (sum, item) => sum + (item.totalPrice?.oneTime || 0),
        0
      ),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    createOrder(order);
    alert(`Order ${orderId} created successfully!`);
    navigate("orders");
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

  if (!currentQuote) {
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

  const isExpired =
    currentQuote.status === "expired" ||
    (currentQuote.expiresAt && new Date(currentQuote.expiresAt) < new Date());
  const canAccept = currentQuote.status === "pending" && !isExpired;
  const canDecline = currentQuote.status === "pending" && !isExpired;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/quotes")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              My Quotes
            </button>
            <span className="text-slate-500">›</span>
            <span className="text-slate-800">{currentQuote.quoteNumber}</span>
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
              onClick={() => setShowDocument(true)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center space-x-2 font-medium"
              title="View quote as PDF document"
            >
              <FileText className="w-4 h-4" />
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
              {currentQuote.quoteNumber}
            </h1>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <span>
                Created {new Date(currentQuote.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className={isExpired ? "text-red-600" : ""}>
                Expires{" "}
                {currentQuote.validUntil ||
                  new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
              </span>
              <span>•</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentQuote.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : currentQuote.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : currentQuote.status === "declined"
                    ? "bg-red-100 text-red-800"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {(currentQuote.status || "pending").charAt(0).toUpperCase() +
                  (currentQuote.status || "pending").slice(1)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Quote Total</p>
              <p className="text-3xl font-bold text-blue-600">
                {fmt(currentQuote.finalTotals?.oneTime || 0)}
              </p>
              <p className="text-xs text-blue-700">One-time charges</p>
              {(currentQuote.finalTotals?.recurring || 0) > 0 && (
                <>
                  <p className="text-xl font-semibold text-blue-600 mt-2">
                    {fmt(currentQuote.finalTotals.recurring)}/month
                  </p>
                  <p className="text-xs text-blue-700">Monthly charges</p>
                </>
              )}
              {(currentQuote.totalSavings || 0) > 0 && (
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-slate-800 mb-3">
            Customer Information
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-600">Name:</span>{" "}
              {currentQuote.customerInfo?.name || "John Smith"}
            </p>
            <p>
              <span className="text-slate-600">Email:</span>{" "}
              {currentQuote.customerInfo?.email || "john.smith@company.com"}
            </p>
            <p>
              <span className="text-slate-600">Company:</span>{" "}
              {currentQuote.customerInfo?.company || "Tech Solutions Inc."}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-slate-800 mb-3">Quote Details</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-600">Currency:</span>{" "}
              {currentQuote.currency || "USD"}
            </p>
            <p>
              <span className="text-slate-600">Valid Until:</span>{" "}
              {currentQuote.validUntil}
            </p>
            <p>
              <span className="text-slate-600">Items:</span>{" "}
              {currentQuote.items.length}
            </p>
          </div>
        </div>

        {currentQuote.initialTermMonths && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-slate-800 mb-3">
              Contract Terms
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-600">Initial Term:</span>{" "}
                {currentQuote.initialTermMonths} months
              </p>
              <p>
                <span className="text-slate-600">Renewal:</span>{" "}
                {currentQuote.renewalPeriodMonths} months
              </p>
              <p>
                <span className="text-slate-600">Notice Period:</span>{" "}
                {currentQuote.nonRenewalNotice} days
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Overview - only show for accepted quotes */}
      {currentQuote.status === "accepted" &&
        (() => {
          // Use current product definitions to check configuration requirements
          const configurableItems = currentQuote.items.filter((item) => {
            return (
              item.product?.configurationRequired || 
              item.needsConfiguration ||
              item.configurationProgress !== undefined ||
              item.configurationStatus ||
              (item.key && ['secure-cabinet', 'ethernet-cross-connect', 'cross-connect'].includes(item.key)) ||
              (item.name && item.name.toLowerCase().includes('cross connect'))
            );
          });

          // Calculate total instances needing configuration (sum of all quantities)
          const totalInstances = configurableItems.reduce((sum, item) => {
            const configScope =
              item.product?.configurationScope || "per-line-item";
            return sum + (configScope === "per-quantity" ? item.qty : 1);
          }, 0);

          // Calculate configured instances (sum of all completed counts)
          const configuredInstances = configurableItems.reduce((sum, item) => {
            const completedCount = item.configuration?.completedCount || 0;
            return sum + completedCount;
          }, 0);

          // Calculate products by status (for the summary boxes)
          const partialProducts = configurableItems.filter(
            (item) => item.configuration?.status === "partial"
          ).length;

          if (totalInstances > 0) {
            return (
              <div className="bg-white rounded-xl shadow-sm border mb-8">
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
                {/* <div className="p-6">
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
                      .map((item, itemIndex) => {
                        const originalIndex = currentQuote.items.findIndex(
                          (origItem) => origItem === item
                        );

                        return (
                          <div
                            key={originalIndex}
                            className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-200"
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
                                {item.name}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  item.configuration?.status === "complete"
                                    ? "bg-green-100 text-green-800"
                                    : item.configuration?.status === "partial"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-slate-100 text-slate-600"
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
                                handleStartConfiguration(originalIndex)
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
                              <Settings className="w-4 h-4" />
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
                </div> */}
              </div>
            );
          }
          return null;
        })()}

      {/* Quote Items */}
      <div className="space-y-6 px-8 py-6 rounded-xl bg-white border border-slate-200 shadow-sm ">
        <div className="flex items-center space-x-3 mb-4 justify-start">
          <h2 className="text-2xl font-bold text-slate-800">Quote Items</h2>
          <p className="bg-blue-500 text-white rounded-full w-7 h-6 flex items-center justify-center text-xs">
            {currentQuote.items.length}
          </p>
        </div>

        {currentQuote.items.map((item, index) => {
          const itemDiscounts = getItemDiscounts(item);
          const originalPrice = getOriginalItemPrice(item);
          const hasDiscounts = itemDiscounts.length > 0;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
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
                        {item.name}
                      </h3>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {item.category}
                      </span>

                      {/* Configuration Status - show for all configurable products */}
                      {(() => {
                        // Check multiple conditions to determine if configuration is required
                        const requiresConfiguration =
                          item.product?.configurationRequired ||
                          item.needsConfiguration ||
                          item.configurationProgress !== undefined ||
                          item.configurationStatus ||
                          (item.key && ['secure-cabinet', 'ethernet-cross-connect', 'cross-connect'].includes(item.key)) ||
                          (item.name && item.name.toLowerCase().includes('cross connect'));

                        // Debug logging (remove in production)
                        if (currentQuote.status === "accepted") {
                          console.log("Configuration check for item:", {
                            name: item.name,
                            key: item.key,
                            productConfigRequired: item.product?.configurationRequired,
                            needsConfiguration: item.needsConfiguration,
                            configurationProgress: item.configurationProgress,
                            configurationStatus: item.configurationStatus,
                            requiresConfiguration
                          });
                        }

                        if (
                          !requiresConfiguration ||
                          currentQuote.status !== "accepted"
                        )
                          return null;

                        return (
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
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full flex items-center space-x-1">
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
                                handleStartConfiguration(index);
                              }}
                              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm ${
                                item.configuration?.status === "complete"
                                  ? "bg-green-100 text-green-800 hover:bg-green-500 hover:text-white border border-green-500"
                                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                              }`}
                              title={
                                item.configuration?.status === "complete"
                                  ? "Product configured - click to review or modify configuration"
                                  : `Configure ${item.name}${
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
                              <Settings className="w-4 h-4" />
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
                        );
                      })()}
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
                    {expandedItems.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Item Details */}
              {expandedItems.has(index) && (
                <div className="border-t bg-slate-50">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Configuration Details */}
                      {item.configuration &&
                        Object.keys(item.configuration).length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-3">
                              Configuration
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(item.configuration).map(
                                ([key, value]) => {
                                  // Skip status and progress fields
                                  if (
                                    [
                                      "status",
                                      "completedCount",
                                      "totalRequired",
                                      "configuredAt",
                                    ].includes(key)
                                  )
                                    return null;

                                  return (
                                    <div
                                      key={key}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-slate-600">
                                        {key.replace(/([A-Z])/g, " $1").trim()}:
                                      </span>
                                      <span className="text-slate-800 font-medium">
                                        {value}
                                      </span>
                                    </div>
                                  );
                                }
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
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Pricing Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {/* One-time charges */}
            <div className="flex justify-between">
              <span className="text-slate-600">One-time charges:</span>
              <span className="font-semibold text-slate-800">
                {fmt(currentQuote.finalTotals?.oneTime || 0)}
              </span>
            </div>

            {/* Monthly recurring charges */}
            <div className="flex justify-between">
              <span className="text-slate-600">Monthly recurring charges:</span>
              <span className="font-semibold text-slate-800">
                {fmt(currentQuote.finalTotals?.recurring || 0)}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <p className="text-sm text-blue-700 mb-2">Grand Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {fmt(currentQuote.finalTotals?.oneTime || 0)}
              </p>
              {(currentQuote.finalTotals?.recurring || 0) > 0 && (
                <p className="text-lg font-semibold text-blue-600">
                  {fmt(currentQuote.finalTotals.recurring)}/month
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Message for non-pending quotes */}
      {currentQuote.status !== "pending" && (
        <div
          className={`mt-8 p-6 rounded-xl text-center ${
            currentQuote.status === "accepted"
              ? "bg-green-50 border border-green-200"
              : currentQuote.status === "declined"
              ? "bg-red-50 border border-red-200"
              : "bg-slate-100 border border-slate-300"
          }`}
        >
          <div
            className={`text-lg font-semibold mb-2 ${
              currentQuote.status === "accepted"
                ? "text-green-800"
                : currentQuote.status === "declined"
                ? "text-red-800"
                : "text-slate-800"
            }`}
          >
            Quote{" "}
            {currentQuote.status.charAt(0).toUpperCase() +
              currentQuote.status.slice(1)}
          </div>
          {currentQuote.status === "accepted" && (
            <p className="text-green-700">
              This quote has been accepted and an order has been created. You
              can now configure your products.
            </p>
          )}
          {currentQuote.status === "declined" && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-red-700">
                This quote has been declined. You can create a new quote by
                adding items to your cart.
              </p>
              <button
                onClick={() => {
                  // In a real app, this could open a chat widget or navigate to contact form
                  alert("Connecting you to our sales team...");
                }}
                className="ml-4 flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mt-4"
                title="Contact Sales Representative"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Sales</span>
              </button>
            </div>
          )}
          {currentQuote.status === "expired" && (
            <p className="text-slate-600">
              This quote has expired. Please create a new quote with updated
              pricing.
            </p>
          )}

          {/* Create Order Button - Only show for accepted quotes */}
          {currentQuote.status === "accepted" &&
            (() => {
              const configurableItems = currentQuote.items.filter(
                (item) => item.needsConfiguration
              );
              const allConfigured = configurableItems.every(
                (item) => item.configurationProgress === 100
              );

              return (
                <div className="mt-6">
                  {!allConfigured && configurableItems.length > 0 && (
                    <p className="text-sm text-slate-600 mt-2">
                      Complete all configurations to create order
                    </p>
                  )}
                </div>
              );
            })()}
        </div>
      )}

      {/* Document Viewer Full Screen */}
      {showDocument && (
        <div className="fixed inset-0 z-50 min-h-screen bg-white">
          {/* Header - Hide on print */}
          <div className="print:hidden bg-white border-b sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowDocument(false)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Quote Overview
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Download
                  </button>
                  {canDecline && (
                    <button
                      onClick={handleDeclineQuote}
                      disabled={isDeclining}
                      className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {isDeclining ? "Declining..." : "Decline"}
                    </button>
                  )}
                  {canAccept && (
                    <button
                      onClick={handleAcceptQuote}
                      disabled={isAccepting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isAccepting ? "Accepting..." : "Accept Quote"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quote Document */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0 print:py-0 overflow-y-auto max-h-screen">
            {/* Quote Header */}
            <div className="border-b-2 border-red-600 pb-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-red-600 text-2xl font-bold tracking-tight mb-2">
                    EQUINIX QUOTE
                  </h1>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Quote Number:</strong> {currentQuote.quoteNumber}
                    </p>
                    <p>
                      <strong>Version:</strong> 1
                    </p>
                    <p>
                      <strong>Currency:</strong> {currentQuote.currency}
                    </p>
                    <p>
                      <strong>Quote Valid Until:</strong>{" "}
                      {currentQuote.validUntil}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-24 bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                    EQUINIX LOGO
                  </div>
                  <div className="mt-2 text-xs">
                    <p>
                      <strong>PREPARED BY:</strong>
                    </p>
                    <p>Sales Representative</p>
                    <p>sales@equinix.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
              <div>
                <h3 className="font-bold mb-2">PREPARED FOR:</h3>
                <p>{currentQuote.customerInfo?.name || "John Smith"}</p>
                <p>
                  {currentQuote.customerInfo?.email || "john.smith@company.com"}
                </p>
                <p>
                  {currentQuote.customerInfo?.company || "Tech Solutions Inc."}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">QUOTE DETAILS:</h3>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(currentQuote.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`capitalize ${
                      currentQuote.status === "pending"
                        ? "text-yellow-600"
                        : currentQuote.status === "accepted"
                        ? "text-green-600"
                        : currentQuote.status === "declined"
                        ? "text-red-600"
                        : "text-slate-600"
                    }`}
                  >
                    {currentQuote.status}
                  </span>
                </p>
                <p>
                  <strong>Expires:</strong> {currentQuote.validUntil}
                </p>
                {currentQuote.initialTermMonths && (
                  <>
                    <p>
                      <strong>Initial Term:</strong>{" "}
                      {currentQuote.initialTermMonths} months
                    </p>
                    <p>
                      <strong>Renewal Period:</strong>{" "}
                      {currentQuote.renewalPeriodMonths} months
                    </p>
                    <p>
                      <strong>Non-renewal Notice:</strong>{" "}
                      {currentQuote.nonRenewalNotice} days
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quote Items */}
            <div className="mb-8 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Quote Items</h3>

              {currentQuote.items.map((item, index) => {
                const itemDiscounts = getItemDiscounts(item);
                const originalPrice = getOriginalItemPrice(item);
                const hasDiscounts = itemDiscounts.length > 0;

                return (
                  <div key={index} className="border border-slate-300 mb-6">
                    {/* Item Header */}
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-xs text-slate-600">
                            {item.category}
                          </p>
                        </div>
                        {hasDiscounts && (
                          <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded border border-green-200">
                            💰 Discount Applied
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Item Details Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-200">
                          <tr>
                            <th className="text-left px-4 py-2 border-b">
                              Product Description
                            </th>
                            <th className="text-center px-4 py-2 border-b w-16">
                              Qty
                            </th>
                            <th className="text-center px-4 py-2 border-b w-20">
                              UoM
                            </th>
                            <th className="text-right px-4 py-2 border-b w-24">
                              NRC
                            </th>
                            <th className="text-right px-4 py-2 border-b w-24">
                              MRC
                            </th>
                            <th className="text-right px-4 py-2 border-b w-24">
                              Total NRC
                            </th>
                            <th className="text-right px-4 py-2 border-b w-24">
                              Total MRC
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Main Product Row */}
                          <tr>
                            <td className="px-4 py-2 border-b">
                              {item.name}
                              {item.configuration &&
                                Object.keys(item.configuration).length > 0 && (
                                  <div className="mt-1 space-y-1">
                                    {Object.entries(item.configuration).map(
                                      ([key, value]) => {
                                        if (
                                          [
                                            "status",
                                            "completedCount",
                                            "totalRequired",
                                            "configuredAt",
                                          ].includes(key)
                                        )
                                          return null;
                                        return (
                                          <div
                                            key={key}
                                            className="text-xs text-slate-600"
                                          >
                                            •{" "}
                                            {key
                                              .replace(/([A-Z])/g, " $1")
                                              .trim()}
                                            : {value}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              {/* Show discount breakdown if applicable */}
                              {hasDiscounts && (
                                <div className="mt-2 space-y-1">
                                  {itemDiscounts.map((discount, dIndex) => (
                                    <div
                                      key={dIndex}
                                      className="text-xs text-green-700"
                                    >
                                      💰{" "}
                                      {discount.pricingComponent === "oneTime"
                                        ? "One-time"
                                        : "Monthly"}{" "}
                                      discount: -{fmt(discount.discountAmount)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="text-center px-4 py-2 border-b">
                              {item.qty}
                            </td>
                            <td className="text-center px-4 py-2 border-b">
                              Each
                            </td>
                            <td className="text-right px-4 py-2 border-b">
                              {fmt(item.unitPrice.oneTime)}
                            </td>
                            <td className="text-right px-4 py-2 border-b">
                              {fmt(item.unitPrice.recurring)}
                            </td>
                            <td className="text-right px-4 py-2 border-b">
                              {hasDiscounts &&
                              originalPrice.oneTime >
                                item.totalPrice.oneTime ? (
                                <div>
                                  <div className="text-xs text-slate-600 line-through">
                                    {fmt(originalPrice.oneTime)}
                                  </div>
                                  <div className="text-green-700 font-semibold">
                                    {fmt(item.totalPrice.oneTime)}
                                  </div>
                                </div>
                              ) : (
                                fmt(item.totalPrice.oneTime)
                              )}
                            </td>
                            <td className="text-right px-4 py-2 border-b">
                              {hasDiscounts &&
                              originalPrice.recurring >
                                item.totalPrice.recurring ? (
                                <div>
                                  <div className="text-xs text-slate-600 line-through">
                                    {fmt(originalPrice.recurring)}
                                  </div>
                                  <div className="text-green-700 font-semibold">
                                    {fmt(item.totalPrice.recurring)}
                                  </div>
                                </div>
                              ) : (
                                fmt(item.totalPrice.recurring)
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Item Section Total */}
                    <div className="bg-slate-100 px-4 py-2 text-sm">
                      <div className="flex justify-between font-semibold">
                        <span>Section Total</span>
                        <div className="space-x-8">
                          <span>{fmt(item.totalPrice.oneTime)}</span>
                          <span>{fmt(item.totalPrice.recurring)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing Summary */}
            <div className="border-t-2 border-slate-800 pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 text-sm">
                  <h3 className="font-bold text-lg">Grand Total</h3>
                  <p>
                    <strong>One-time charges:</strong>{" "}
                    {fmt(currentQuote.finalTotals?.oneTime || 0)}
                  </p>
                  <p>
                    <strong>Monthly recurring charges:</strong>{" "}
                    {fmt(currentQuote.finalTotals?.recurring || 0)}
                  </p>

                  {(currentQuote.totalSavings || 0) > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-semibold">
                        Total Savings: {fmt(currentQuote.totalSavings)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Original Total:{" "}
                        {fmt(
                          (currentQuote.originalTotals?.oneTime || 0) +
                            (currentQuote.originalTotals?.recurring || 0)
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-2">Quote Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {fmt(currentQuote.finalTotals?.oneTime || 0)}
                    </p>
                    {(currentQuote.finalTotals?.recurring || 0) > 0 && (
                      <p className="text-lg font-semibold text-blue-600">
                        {fmt(currentQuote.finalTotals.recurring)}/mo
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-8 pt-6 border-t text-xs text-slate-600">
              <p className="mb-2">
                <strong>Terms:</strong> From the Effective Date, the Licensed
                Space and Services shall be provided to Customer free of charge
                for the number of months indicated in the Free Months column
                above.
              </p>
              <p className="text-center mt-4">
                <strong>Quote Number:</strong> {currentQuote.quoteNumber} | Page
                1 of 2
              </p>
            </div>

            {/* Page Break for Terms and Conditions */}
            <div className="print:break-before-page mt-12 pt-8">
              <div className="border-b-2 border-red-600 pb-6 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-red-600 text-2xl font-bold tracking-tight mb-2">
                      EQUINIX TERMS AND CONDITIONS
                    </h1>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Quote Number:</strong>{" "}
                        {currentQuote.quoteNumber}
                      </p>
                      <p>
                        <strong>Customer:</strong>{" "}
                        {currentQuote.customerInfo?.company ||
                          "Tech Solutions Inc."}
                      </p>
                      <p>
                        <strong>Effective Date:</strong>{" "}
                        {new Date(currentQuote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 h-24 bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                      EQUINIX LOGO
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Content */}
              <div className="space-y-6 text-sm leading-relaxed">
                <section>
                  <h3 className="font-bold text-lg mb-3 text-slate-800">
                    1. GENERAL TERMS
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>1.1 Agreement.</strong> This Quote, when accepted
                      by Customer and executed by Equinix, shall constitute a
                      binding agreement ("Agreement") between Equinix, Inc.
                      ("Equinix") and the customer identified above ("Customer")
                      for the provision of colocation, interconnection, and
                      related services ("Services") at the Equinix International
                      Business Exchange™ facilities.
                    </p>
                    <p>
                      <strong>1.2 Services.</strong> Equinix shall provide the
                      Services described in this Quote in accordance with
                      Equinix's standard terms and conditions, service level
                      agreements, and acceptable use policies, all of which are
                      incorporated herein by reference and available at
                      www.equinix.com/company/legal/.
                    </p>
                    <p>
                      <strong>1.3 Term.</strong> The initial term shall commence
                      on the date Equinix makes the Services available to
                      Customer and shall continue for the period specified in
                      this Quote. The Agreement shall automatically renew for
                      successive renewal periods as specified herein unless
                      either party provides written notice of non-renewal at
                      least {currentQuote.nonRenewalNotice || 30} days prior to
                      the end of the then-current term.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-3 text-slate-800">
                    2. PAYMENT TERMS
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>2.1 Fees.</strong> Customer shall pay all fees
                      specified in this Quote. One-time fees are due upon
                      execution of this Agreement. Recurring fees are due
                      monthly in advance. All fees are non-refundable except as
                      expressly provided herein.
                    </p>
                    <p>
                      <strong>2.2 Payment.</strong> Payment terms are net 30
                      days from invoice date. Late payments may be subject to a
                      service charge of 1.5% per month or the maximum rate
                      permitted by law, whichever is less. All fees are
                      exclusive of taxes, duties, and other governmental
                      charges.
                    </p>
                    <p>
                      <strong>2.3 Price Changes.</strong> Equinix may increase
                      recurring fees upon 90 days' written notice, but not more
                      than once per calendar year during the initial term.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-3 text-slate-800">
                    3. ACCEPTANCE
                  </h3>
                  <div className="space-y-4">
                    <p>
                      By accepting this Quote, Customer acknowledges that it has
                      read, understood, and agrees to be bound by these terms
                      and conditions.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mt-8 pt-4 border-t">
                      <div>
                        <p className="font-bold mb-4">EQUINIX, INC.</p>
                        <div className="border-b border-gray-400 mb-2 h-8 flex items-end">
                          <span className="text-sm italic text-slate-600">
                            Authorized Representative
                          </span>
                        </div>
                        <p className="text-xs">Signature</p>
                        <div className="mt-4">
                          <div className="border-b border-gray-400 mb-2 h-8 flex items-end">
                            <span className="text-sm italic text-slate-600">
                              Sales Representative
                            </span>
                          </div>
                          <p className="text-xs">Print Name and Title</p>
                        </div>
                        <div className="mt-4">
                          <div className="border-b border-gray-400 mb-2 h-8 flex items-end">
                            <span className="text-sm italic text-slate-600">
                              {new Date(
                                currentQuote.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs">Date</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-bold mb-4">
                          {(
                            currentQuote.customerInfo?.company ||
                            "TECH SOLUTIONS INC."
                          ).toUpperCase()}
                        </p>
                        {/* Show electronic signature if accepted */}
                        {currentQuote.status === "accepted" ? (
                          <div>
                            <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
                              <div className="text-sm font-semibold text-green-800">
                                ✓ ELECTRONICALLY SIGNED
                              </div>
                              <div className="text-xs text-green-700 mt-1">
                                Signed by:{" "}
                                {currentQuote.customerInfo?.name ||
                                  "John Smith"}
                                <br />
                                Email:{" "}
                                {currentQuote.customerInfo?.email ||
                                  "john.smith@company.com"}
                                <br />
                                Date:{" "}
                                {new Date(
                                  currentQuote.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                            <p className="text-xs">Electronic Signature</p>
                          </div>
                        ) : currentQuote.status === "declined" ? (
                          <div>
                            <div className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                              <div className="text-sm font-semibold text-red-800">
                                ✗ DECLINED
                              </div>
                              <div className="text-xs text-red-700 mt-1">
                                Declined by:{" "}
                                {currentQuote.customerInfo?.name ||
                                  "John Smith"}
                                <br />
                                Email:{" "}
                                {currentQuote.customerInfo?.email ||
                                  "john.smith@company.com"}
                                <br />
                                Date:{" "}
                                {new Date(
                                  currentQuote.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                            <p className="text-xs">Electronic Response</p>
                          </div>
                        ) : (
                          <div>
                            <div className="border-b border-gray-400 mb-2 h-8"></div>
                            <p className="text-xs">Signature</p>
                          </div>
                        )}
                        <div className="mt-4">
                          <div className="border-b border-gray-400 mb-2 h-8 flex items-end">
                            {currentQuote.status === "accepted" && (
                              <span className="text-sm italic text-slate-600">
                                {currentQuote.customerInfo?.name ||
                                  "John Smith"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs">Print Name and Title</p>
                        </div>
                        <div className="mt-4">
                          <div className="border-b border-gray-400 mb-2 h-8 flex items-end">
                            {currentQuote.status === "accepted" && (
                              <span className="text-sm italic text-slate-600">
                                {new Date(
                                  currentQuote.createdAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs">Date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Page Footer */}
              <div className="mt-8 pt-4 border-t text-xs text-slate-600 text-center">
                <p>
                  <strong>Quote Number:</strong> {currentQuote.quoteNumber} |
                  Page 2 of 2
                </p>
                <p className="mt-2">
                  Equinix, Inc. | One Lagoon Drive | Redwood City, CA 94065 |
                  www.equinix.com
                </p>
              </div>
            </div>

            {/* Status Banner for non-pending quotes */}
            {currentQuote.status !== "pending" && (
              <div
                className={`mt-8 p-4 rounded-lg text-center font-semibold ${
                  currentQuote.status === "accepted"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : currentQuote.status === "declined"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-slate-100 text-slate-800 border border-slate-300"
                }`}
              >
                Quote Status:{" "}
                {currentQuote.status.charAt(0).toUpperCase() +
                  currentQuote.status.slice(1)}
                {currentQuote.status === "accepted" && (
                  <div className="text-sm mt-1">
                    Order has been created and is ready for configuration.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteDetails;
