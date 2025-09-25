import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { ArrowLeft, Save, Settings } from "lucide-react";

export default function ItemConfiguration() {
  const { quoteId, itemIndex } = useParams();
  const navigate = useNavigate();
  const { quotes } = useStore();
  const [quote, setQuote] = useState(null);
  const [item, setItem] = useState(null);
  const [configData, setConfigData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quoteId && itemIndex) {
      const foundQuote = quotes.find((q) => q.id === quoteId);
      if (foundQuote && foundQuote.items[parseInt(itemIndex)]) {
        setQuote(foundQuote);
        const foundItem = foundQuote.items[parseInt(itemIndex)];
        setItem(foundItem);

        // Initialize form data with existing configuration if any
        const existingConfig = foundItem.configuration || {};
        setConfigData({
          location: existingConfig.location || "",
          bandwidth: existingConfig.bandwidth || "",
          connectionType: existingConfig.connectionType || "",
          redundancy: existingConfig.redundancy || "single",
          monitoring: existingConfig.monitoring || false,
          notes: existingConfig.notes || "",
        });
      }
    }
    setIsLoading(false);
  }, [quoteId, itemIndex, quotes]);

  const handleInputChange = (field, value) => {
    setConfigData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveConfiguration = async () => {
    if (!quote || !item) return;

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would normally update the quote in your store with the configuration
      // For now, we'll just simulate the save and navigate back

      alert("Configuration saved successfully!");
      navigate(`/quoteDetails?id=${quoteId}`);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!quote || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Configuration Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The requested item configuration could not be found.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/quoteDetails?id=${quoteId}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quote Details
          </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Configure Product
                </h1>
                <p className="text-slate-600 mt-1">{item.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-600 font-medium">Category:</span>
                <span className="ml-2 font-bold text-slate-800">
                  {item.category}
                </span>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Quantity:</span>
                <span className="ml-2 font-bold text-slate-800">
                  {item.qty}
                </span>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Quote:</span>
                <span className="ml-2 font-bold text-slate-800">
                  {quote.quoteNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Product Configuration
          </h2>

          <div className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deployment Location *
              </label>
              <select
                value={configData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select a location</option>
                <option value="NY1">NY1 - New York</option>
                <option value="SV1">SV1 - Silicon Valley</option>
                <option value="DC1">DC1 - Washington DC</option>
                <option value="LA1">LA1 - Los Angeles</option>
                <option value="CH1">CH1 - Chicago</option>
              </select>
            </div>

            {/* Bandwidth */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bandwidth Requirement *
              </label>
              <select
                value={configData.bandwidth}
                onChange={(e) => handleInputChange("bandwidth", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select bandwidth</option>
                <option value="100M">100 Mbps</option>
                <option value="1G">1 Gbps</option>
                <option value="10G">10 Gbps</option>
                <option value="100G">100 Gbps</option>
              </select>
            </div>

            {/* Connection Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Connection Type *
              </label>
              <select
                value={configData.connectionType}
                onChange={(e) =>
                  handleInputChange("connectionType", e.target.value)
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select connection type</option>
                <option value="single-mode">Single Mode Fiber</option>
                <option value="multi-mode">Multi Mode Fiber</option>
                <option value="copper">Copper</option>
              </select>
            </div>

            {/* Redundancy */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Redundancy Level
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="redundancy"
                    value="single"
                    checked={configData.redundancy === "single"}
                    onChange={(e) =>
                      handleInputChange("redundancy", e.target.value)
                    }
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Single Connection</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="redundancy"
                    value="redundant"
                    checked={configData.redundancy === "redundant"}
                    onChange={(e) =>
                      handleInputChange("redundancy", e.target.value)
                    }
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Redundant Connection</span>
                </label>
              </div>
            </div>

            {/* Monitoring */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={configData.monitoring}
                  onChange={(e) =>
                    handleInputChange("monitoring", e.target.checked)
                  }
                  className="mr-3 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-slate-700 font-medium">
                  Enable 24/7 Monitoring
                </span>
              </label>
              <p className="text-sm text-slate-500 mt-1 ml-6">
                Additional monitoring and alerting services
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={configData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => navigate(`/quoteDetails?id=${quoteId}`)}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveConfiguration}
              disabled={
                isSaving ||
                !configData.location ||
                !configData.bandwidth ||
                !configData.connectionType
              }
              className={`px-8 py-3 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 shadow-lg ${
                isSaving ||
                !configData.location ||
                !configData.bandwidth ||
                !configData.connectionType
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
