import React from "react";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { useStore } from "../hooks/useStore";
import { formatCurrency } from "../utils/calculations";

const Packages = () => {
  const {
    packages,
    navigate,
    removeFromPackages,
    addToCart,
    getPackagesTotal,
  } = useStore();

  const handleAddToCart = (packageItem) => {
    addToCart(packageItem);
    navigate("cart");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </button>
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-equinix-dark">Packages</h1>
        </div>
        <p className="text-gray-600 mt-2">Review your package selections</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        {packages.length === 0 ? (
          <div className="text-center py-12 p-6">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <div className="text-gray-500 text-lg mb-4">
              No packages selected
            </div>
            <button onClick={() => navigate("home")} className="btn-primary">
              Discover Packages
            </button>
          </div>
        ) : (
          <>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Package Items ({packages.length})
              </h2>
              <div className="space-y-4">
                {packages.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(item.price)}/mo
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="btn-primary flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    {item.configuration && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                        {Object.entries(item.configuration).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between bg-gray-50 p-2 rounded"
                            >
                              <span className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="text-equinix-dark font-semibold">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Package Summary */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-xl font-semibold">
                    Total Monthly Cost:
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    {packages.length} package{packages.length !== 1 ? "s" : ""}{" "}
                    selected
                  </div>
                </div>
                <span className="text-3xl font-bold text-green-600">
                  {formatCurrency(getPackagesTotal())}/mo
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("home")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Discovery
                </button>
                <button
                  onClick={() => {
                    packages.forEach((pkg) => addToCart(pkg));
                    navigate("cart");
                  }}
                  className="flex-1 px-6 py-3 bg-equinix-blue text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Packages;
