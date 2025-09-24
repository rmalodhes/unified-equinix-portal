import React from "react";
import { Search } from "lucide-react";
import { CATEGORIES, IBX_OPTIONS, CAGE_OPTIONS } from "../../utils/constants";
import { useStore } from "../../hooks/useStore";

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  offeringFilter,
  setOfferingFilter,
}) => {
  const { selectedIBX, selectedCage, setSelectedIBX, setSelectedCage } =
    useStore();
  return (
    <div className="mb-8 space-y-8">
      {/* Premium Hero Section */}
      <div className="hero-container rounded-3xl p-10 text-gray-800 overflow-hidden group mb-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-6 right-8 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute bottom-6 left-8 w-12 h-12 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-lg animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-indigo-400/6 to-purple-400/6 rounded-full blur-2xl animate-gentle-pulse"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 via-equinix-blue to-indigo-600 bg-clip-text text-transparent animate-gradient">
            Equinix Infrastructure Solutions
          </h1>
          <p className="text-gray-600 text-xl transition-colors duration-500 group-hover:text-gray-700 font-medium">
            Discover our comprehensive connectivity and colocation services
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-equinix-blue to-purple-600 rounded-full mx-auto opacity-70"></div>
        </div>
      </div>

      {/* IBX and Cage Selection - Compact */}
      <div className="flex gap-6 items-center justify-center">
        <div className="w-52">
          <label className="block text-md font-medium text-gray-600 mb-1 ">
            IBX Location
          </label>
          <select
            value={selectedIBX}
            onChange={(e) => setSelectedIBX(e.target.value)}
            className="w-full px-3 py-2 text-md border border-gray-200 rounded-lg focus:ring-1 focus:ring-equinix-blue/30 focus:border-equinix-blue/50 transition-all duration-300 text-gray-800 font-medium hover:bg-gray-50 focus:bg-white cursor-pointer select-secondary"
          >
            {IBX_OPTIONS.map((ibx) => (
              <option key={ibx} value={ibx}>
                {ibx}
              </option>
            ))}
          </select>
        </div>

        <div className="w-60">
          <label className="block text-md font-medium text-gray-600 mb-1">
            Cage Selection
          </label>
          <select
            value={selectedCage}
            onChange={(e) => setSelectedCage(e.target.value)}
            className="w-full px-3 py-2 text-md border border-gray-200 rounded-lg focus:ring-1 focus:ring-equinix-blue/30 focus:border-equinix-blue/50 transition-all duration-300 text-gray-800 font-medium hover:bg-gray-50 focus:bg-white cursor-pointer select-secondary"
          >
            {CAGE_OPTIONS.map((cage) => (
              <option key={cage} value={cage}>
                {cage}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Premium Filter Buttons and Search Section */}
      <div className="filter-container rounded-2xl p-8 transition-all duration-500 hover:shadow-xl">
        <div className="flex gap-6 items-center justify-between">
          {/* Filter Buttons */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setOfferingFilter("all")}
              className={
                offeringFilter === "all" ? "btn-primary" : "btn-secondary"
              }
            >
              All Offerings
            </button>
            <button
              onClick={() => setOfferingFilter("package")}
              className={
                offeringFilter === "package" ? "btn-primary" : "btn-secondary"
              }
            >
              Package Offerings
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 focus-within:text-equinix-blue transition-all duration-300" />
              <input
                type="text"
                placeholder={
                  offeringFilter === "package"
                    ? "Search packages..."
                    : "Search offerings..."
                }
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-equinix-blue/30 focus:border-equinix-blue/50 focus:bg-white transition-all duration-500 text-gray-800 placeholder-gray-400 hover:bg-gray-50 focus:shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter - Hidden for Package Offerings */}
          {offeringFilter !== "package" && (
            <div className="min-w-[200px]">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-equinix-blue/30 focus:border-equinix-blue/50 transition-all duration-500 text-gray-800 font-medium hover:bg-gray-50 focus:bg-white focus:shadow-sm"
              >
                <option value={CATEGORIES.ALL}>All Categories</option>
                <option value={CATEGORIES.COLOCATION}>Colocation</option>
                <option value={CATEGORIES.INTERCONNECTION}>
                  Interconnection
                </option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
