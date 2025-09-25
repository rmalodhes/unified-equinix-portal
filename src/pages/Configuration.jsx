import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { ArrowLeft, Settings, CheckCircle2, AlertCircle } from "lucide-react";

// Generic internal configuration page for platform-managed products
export default function Configuration() {
  const { quoteId, itemIndex } = useParams();
  const navigate = useNavigate();
  const { quotes, createOrder, updateQuote } = useStore();

  const [saving, setSaving] = useState(false);
  const [quote, setQuote] = useState(null);
  const [lineItem, setLineItem] = useState(null);
  const [configData, setConfigData] = useState({});

  // Load quote and line item data
  useEffect(() => {
    if (quoteId && itemIndex) {
      const foundQuote = quotes.find((q) => q.id === quoteId);

      if (foundQuote) {
        // Check if quote is accepted - configuration only allowed for accepted quotes
        if (foundQuote.status !== "accepted") {
          setQuote(null);
          setLineItem(null);
          return;
        }

        setQuote(foundQuote);
        const itemIdx = parseInt(itemIndex);
        const foundLineItem = foundQuote.items?.[itemIdx];

        if (foundLineItem) {
          setLineItem(foundLineItem);
        }
      }
    }
  }, [quoteId, itemIndex, quotes]);

  const handleSaveConfiguration = async () => {
    setSaving(true);
    try {
      // Generate order number in consistent format 1-XXXXXXXXXX
      const generateOrderNumber = () => {
        const timestamp = Date.now().toString();
        return `1-${timestamp}`;
      };
      const orderNumber = generateOrderNumber();
      const configSummary = `${lineItem.name} configured for ${
        quote.customerInfo?.company || "Customer"
      }`;

      // Create order from configuration
      const orderData = {
        quoteId: quoteId,
        items: [
          {
            ...lineItem,
            configurationData: configData,
            configurationStatus: "complete",
            configuredAt: new Date().toISOString(),
          },
        ],
        total: lineItem.totalPrice?.oneTime || lineItem.price || 0,
        monthlyTotal: lineItem.totalPrice?.recurring || 0,
        status: "pending",
        orderNumber: orderNumber,
        configurationSummary: configSummary,
        customerInfo: quote.customerInfo || {
          name: "John Smith",
          email: "john.smith@company.com",
          company: "Tech Solutions Inc.",
        },
      };

      // Create the order using the store's createOrder function
      createOrder(orderData);

      // Update the quote in the store to mark this item as configured
      const updatedItems = quote.items.map((item, idx) => {
        if (idx === parseInt(itemIndex)) {
          // Calculate new completion count and status
          const currentCompletedCount = item.configuration?.completedCount || 0;
          const configScope =
            item.product?.configurationScope || "per-line-item";
          const totalRequired = configScope === "per-quantity" ? item.qty : 1;
          const newCompletedCount = Math.min(
            currentCompletedCount + 1,
            totalRequired
          );

          // Determine new status based on completion
          let newStatus = "not-started";
          if (newCompletedCount === totalRequired) {
            newStatus = "complete";
          } else if (newCompletedCount > 0) {
            newStatus = "partial";
          }

          return {
            ...item,
            configurationProgress: Math.round(
              (newCompletedCount / totalRequired) * 100
            ),
            configurationStatus: newStatus,
            configuredAt: new Date().toISOString(),
            configurationData: configData,
            configuration: {
              ...item.configuration,
              status: newStatus,
              completedCount: newCompletedCount,
              totalRequired: totalRequired,
              configuredAt: new Date().toISOString(),
              ...configData,
            },
          };
        }
        return item;
      });

      updateQuote(quoteId, { items: updatedItems });

      console.log("Configuration saved and order created:", orderData);

      // Navigate back to quote details with success message
      const configScope =
        lineItem.product?.configurationScope || "per-line-item";
      const totalRequired = configScope === "per-quantity" ? lineItem.qty : 1;
      const currentCompleted =
        (lineItem.configuration?.completedCount || 0) + 1;

      let message = `Configuration completed! Order ${orderData.orderNumber} has been created for ${lineItem.name}.`;

      if (totalRequired > 1) {
        if (currentCompleted === totalRequired) {
          message = `All configurations completed! Order ${orderData.orderNumber} has been created for ${lineItem.name} (${currentCompleted}/${totalRequired} instances configured).`;
        } else {
          message = `Configuration saved! Order ${orderData.orderNumber} has been created for ${lineItem.name}. Progress: ${currentCompleted}/${totalRequired} instances configured.`;
        }
      }

      navigate(`/quoteDetails?id=${quoteId}`, {
        state: { message },
      });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!quote || !lineItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {!quote ? (
            <>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">
                Configuration Not Available
              </h1>
              <p className="text-slate-600 mb-6">
                Configuration is only available for accepted quotes. Please
                accept the quote first.
              </p>
              <button
                onClick={() => navigate("/quotes")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Quotes
              </button>
            </>
          ) : (
            <>
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading configuration...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/quoteDetails?id=${quoteId}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quote
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {lineItem.name} Configuration
              </h1>
              <p className="text-slate-600">
                Configure your {lineItem.name.toLowerCase()} service
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-slate-500">Quote ID:</span>
                <span className="text-sm font-medium text-slate-800">
                  {quote.id}
                </span>
                <span className="text-sm text-slate-500">•</span>
                <span className="text-sm text-slate-500">Quantity:</span>
                <span className="text-sm font-medium text-slate-800">
                  {lineItem.qty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Service Configuration
          </h3>

          {/* Product-specific configuration based on product type */}
          {(lineItem.key === "secure-cabinet" ||
            lineItem.category === "Colocation") && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Data Center Location
                </label>
                <select
                  value={configData.location || ""}
                  onChange={(e) =>
                    setConfigData({ ...configData, location: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Location</option>
                  <option value="sv1">SV1 - Silicon Valley</option>
                  <option value="ny4">NY4 - New York</option>
                  <option value="ld5">LD5 - London</option>
                  <option value="ty3">TY3 - Tokyo</option>
                  <option value="sy3">SY3 - Sydney</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Power Requirements
                </label>
                <select
                  value={configData.power || ""}
                  onChange={(e) =>
                    setConfigData({ ...configData, power: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Power</option>
                  <option value="2.5kw">2.5 kW</option>
                  <option value="5kw">5 kW</option>
                  <option value="10kw">10 kW</option>
                  <option value="20kw">20 kW</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Network Requirements
                </label>
                <textarea
                  value={configData.network || ""}
                  onChange={(e) =>
                    setConfigData({ ...configData, network: e.target.value })
                  }
                  placeholder="Describe your network connectivity requirements..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cooling Requirements
                </label>
                <select
                  value={configData.cooling || ""}
                  onChange={(e) =>
                    setConfigData({ ...configData, cooling: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Cooling</option>
                  <option value="standard">Standard Cooling</option>
                  <option value="high-density">High Density Cooling</option>
                  <option value="liquid">Liquid Cooling</option>
                </select>
              </div>
            </div>
          )}

          {(lineItem.key === "ethernet-cross-connect" ||
            lineItem.category === "Interconnection") && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Connection Type
                </label>
                <select
                  value={configData.connectionType || ""}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      connectionType: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Connection Type</option>
                  <option value="evpl">
                    Ethernet Virtual Private Line (EVPL)
                  </option>
                  <option value="epl">Ethernet Private Line (EPL)</option>
                  <option value="evplan">
                    Ethernet Virtual Private LAN (EVPLAN)
                  </option>
                  <option value="single-mode">Single Mode Fiber</option>
                  <option value="multi-mode">Multi Mode Fiber</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bandwidth
                </label>
                <select
                  value={configData.bandwidth || ""}
                  onChange={(e) =>
                    setConfigData({ ...configData, bandwidth: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Bandwidth</option>
                  <option value="50mbps">50 Mbps</option>
                  <option value="100mbps">100 Mbps</option>
                  <option value="200mbps">200 Mbps</option>
                  <option value="500mbps">500 Mbps</option>
                  <option value="1gbps">1 Gbps</option>
                  <option value="10gbps">10 Gbps</option>
                  <option value="100gbps">100 Gbps</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  VLAN ID (Optional)
                </label>
                <input
                  type="number"
                  value={configData.vlanId || ""}
                  onChange={(e) =>
                    setConfigData({ ...configData, vlanId: e.target.value })
                  }
                  placeholder="e.g., 100"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  min="1"
                  max="4094"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  A-End Location
                </label>
                <input
                  type="text"
                  value={configData.aEndLocation || ""}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      aEndLocation: e.target.value,
                    })
                  }
                  placeholder="e.g., Cage 123 in NY4"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Z-End Location
                </label>
                <input
                  type="text"
                  value={configData.zEndLocation || ""}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      zEndLocation: e.target.value,
                    })
                  }
                  placeholder="e.g., Cage 456 in NY4"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Generic configuration for other products */}
          {!["secure-cabinet", "ethernet-cross-connect"].includes(
            lineItem.key
          ) &&
            !["Colocation", "Interconnection"].includes(lineItem.category) && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Location
                  </label>
                  <select
                    value={configData.location || ""}
                    onChange={(e) =>
                      setConfigData({ ...configData, location: e.target.value })
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Location</option>
                    <option value="sv1">SV1 - Silicon Valley</option>
                    <option value="ny4">NY4 - New York</option>
                    <option value="ld5">LD5 - London</option>
                    <option value="ty3">TY3 - Tokyo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Configuration Notes
                  </label>
                  <textarea
                    value={configData.notes || ""}
                    onChange={(e) =>
                      setConfigData({ ...configData, notes: e.target.value })
                    }
                    placeholder="Any specific configuration requirements or notes..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-24"
                  />
                </div>
              </div>
            )}
        </div>

        {/* Configuration Summary */}
        {Object.keys(configData).length > 0 && (
          <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Configuration Summary
            </h3>
            <div className="text-sm text-slate-600 space-y-2">
              {Object.entries(configData)
                .filter(([, value]) => value)
                .map(([key, value]) => (
                  <div key={key} className="flex items-start">
                    <span className="font-medium capitalize w-40 flex-shrink-0">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      :
                    </span>
                    <span className="text-slate-800">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(`/quoteDetails?id=${quoteId}`)}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveConfiguration}
            disabled={
              Object.entries(configData).filter(([, value]) => value).length ===
                0 || saving
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Configuration...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Create Order
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Configuration Information
          </h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Service Type:</strong> {lineItem.name} -{" "}
              {lineItem.category}
            </p>
            <p>
              <strong>Quantity:</strong> {lineItem.qty} instance
              {lineItem.qty !== 1 ? "s" : ""}
            </p>
            <p>
              <strong>Quote Status:</strong> {quote.status}
            </p>
            <div className="pt-2 border-t border-blue-200">
              <p>
                <strong>Note:</strong> This is a platform-managed configuration.
                Different products may have different configuration requirements
                and forms. Once saved, this configuration will create an order
                and mark the item as configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
