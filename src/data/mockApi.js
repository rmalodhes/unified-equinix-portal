import { productData } from "./productData";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Get all products with optional filtering
  async getProducts(filters = {}) {
    await delay(800); // Simulate network delay

    let filteredProducts = [...productData];

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply location filter
    if (filters.location) {
      filteredProducts = filteredProducts.filter((product) =>
        product.locations.includes(filters.location)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.includes("+")
        ? [parseInt(filters.priceRange.replace("+", "")), Infinity]
        : filters.priceRange.split("-").map(Number);

      filteredProducts = filteredProducts.filter((product) => {
        const price = product.pricing.startingPrice;
        return price >= min && (max === Infinity || price <= max);
      });
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.features.some((feature) =>
            feature.toLowerCase().includes(searchTerm)
          )
      );
    }

    return {
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    };
  },

  // Get a single product by ID
  async getProduct(id) {
    await delay(300);

    const product = productData.find((p) => p.id === id);

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      data: product,
    };
  },

  // Calculate pricing for selected products
  async calculatePricing(selectedProducts) {
    await delay(500);

    if (!selectedProducts || selectedProducts.length === 0) {
      return {
        success: false,
        error: "No products selected",
      };
    }

    const calculations = selectedProducts
      .map((selection) => {
        const product = productData.find((p) => p.id === selection.productId);
        if (!product) return null;

        const basePrice = product.pricing.startingPrice;
        const quantity = selection.quantity || 1;
        const customizations = selection.customizations || {};

        // Apply customization pricing (simplified)
        let customizationCost = 0;
        if (customizations.bandwidth) {
          customizationCost += customizations.bandwidth * 0.1; // $0.10 per Mbps
        }
        if (customizations.storage) {
          customizationCost += customizations.storage * 0.05; // $0.05 per GB
        }

        const subtotal = (basePrice + customizationCost) * quantity;

        return {
          productId: product.id,
          productName: product.name,
          basePrice,
          customizationCost,
          quantity,
          subtotal,
          billingModel: product.pricing.billingModel,
        };
      })
      .filter(Boolean);

    const totalMonthlyCost = calculations
      .filter((calc) => calc.billingModel === "monthly")
      .reduce((sum, calc) => sum + calc.subtotal, 0);

    const totalHourlyCost = calculations
      .filter((calc) => calc.billingModel === "hourly")
      .reduce((sum, calc) => sum + calc.subtotal, 0);

    return {
      success: true,
      data: {
        calculations,
        summary: {
          totalMonthlyCost,
          totalHourlyCost,
          estimatedMonthlyTotal: totalMonthlyCost + totalHourlyCost * 24 * 30,
        },
      },
    };
  },

  // Submit an order
  async submitOrder(orderData) {
    await delay(1000);

    // Simulate order validation
    if (!orderData.products || orderData.products.length === 0) {
      return {
        success: false,
        error: "No products in order",
      };
    }

    if (!orderData.customerInfo) {
      return {
        success: false,
        error: "Customer information required",
      };
    }

    // Generate order ID
    const orderId = `EQ-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    return {
      success: true,
      data: {
        orderId,
        status: "submitted",
        estimatedProcessingTime: "2-5 business days",
        submittedAt: new Date().toISOString(),
      },
    };
  },

  // Get order status
  async getOrderStatus(orderId) {
    await delay(400);

    // Simulate order status
    const statuses = ["submitted", "processing", "provisioning", "completed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      success: true,
      data: {
        orderId,
        status: randomStatus,
        lastUpdated: new Date().toISOString(),
        estimatedCompletion: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
  },
};

export default mockApi;
