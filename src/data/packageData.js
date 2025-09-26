import {
  Building,
  Server,
  Cable,
  Network,
  Zap,
  Globe,
  MapPin,
  Package,
} from "lucide-react";

export const packageData = {
  "complete-colocation": {
    id: "complete-colocation",
    name: "Complete Colocation Package",
    category: "Package",
    icon: Package,
    description:
      "Everything you need for secure colocation with high-performance connectivity",
    originalPrice: 1470, // Sum of individual prices: 850 + 120 + 500
    discountedPrice: 1200,
    discount: 18, // percentage
    setupFee: 400, // One-time setup fee for package
    discountedSetupFee: 300, // Discounted setup fee
    includedProducts: [
      {
        name: "Secure Cabinet Express",
        category: "Colocation",
        description: "High-security cabinet space with 24/7 access",
        originalPrice: 850,
      },
      {
        name: "Patch Panel",
        category: "Interconnection",
        description: "Flexible patch panel solutions with 24 ports",
        originalPrice: 120,
      },
      {
        name: "Fiber Connect",
        category: "Interconnection",
        description: "High-speed 1G fiber connectivity",
        originalPrice: 500,
      },
    ],
    features: [
      "Secure cabinet space with 24/7 access",
      "24-port patch panel with LC connectors",
      "1Gbps dedicated fiber connection",
      "Professional installation included",
      "Priority technical support",
      "18% savings compared to individual purchase",
    ],
    configuration: {
      cabinetSize: "Full Rack",
      patchPanelPorts: "24",
      fiberSpeed: "1G",
      setupTime: "2 days",
    },
  },
  "enterprise-connectivity": {
    id: "enterprise-connectivity",
    name: "Enterprise Connectivity Suite",
    category: "Package",
    icon: Package,
    description:
      "Complete enterprise-grade connectivity solution with redundancy",
    originalPrice: 2200, // Sum: 750 + 1200 + 250
    discountedPrice: 1850,
    discount: 16,
    setupFee: 800, // One-time setup fee for enterprise package
    discountedSetupFee: 600, // Discounted setup fee
    includedProducts: [
      {
        name: "Metro Connect",
        category: "Interconnection",
        description: "Metro area network with 1Gbps bandwidth",
        originalPrice: 750,
      },
      {
        name: "Fiber Connect",
        category: "Interconnection",
        description: "High-speed 10G fiber connectivity",
        originalPrice: 1200,
      },
      {
        name: "Campus Connect",
        category: "Interconnection",
        description: "Campus-wide MPLS connectivity for 5 locations",
        originalPrice: 850,
      },
    ],
    features: [
      "Metro area connectivity with 1Gbps bandwidth",
      "10Gbps high-speed fiber connection",
      "MPLS campus network for up to 5 locations",
      "Active/Standby redundancy included",
      "Advanced network monitoring",
      "16% savings compared to individual purchase",
    ],
    configuration: {
      metroBandwidth: "1G",
      fiberSpeed: "10G",
      campusLocations: "5",
      redundancy: "Active/Standby",
    },
  },
  "startup-essentials": {
    id: "startup-essentials",
    name: "Startup Essentials Package",
    category: "Package",
    icon: Package,
    description:
      "Perfect starter package for growing businesses with basic connectivity needs",
    originalPrice: 1420, // Sum: 850 + 120 + 450
    discountedPrice: 1150,
    discount: 19,
    setupFee: 250, // One-time setup fee for startup package
    discountedSetupFee: 200, // Discounted setup fee
    includedProducts: [
      {
        name: "Secure Cabinet Express",
        category: "Colocation",
        description: "Secure cabinet with basic power allocation",
        originalPrice: 850,
      },
      {
        name: "Patch Panel",
        category: "Interconnection",
        description: "12-port RJ45 patch panel for basic connectivity",
        originalPrice: 120,
      },
      {
        name: "Campus Connect",
        category: "Interconnection",
        description: "Basic Ethernet connectivity for 2 locations",
        originalPrice: 450,
      },
    ],
    features: [
      "Secure cabinet space for startup needs",
      "12-port RJ45 patch panel",
      "Basic Ethernet campus connectivity",
      "Standard installation included",
      "Business hours support",
      "19% savings compared to individual purchase",
    ],
    configuration: {
      cabinetSize: "Quarter Rack",
      patchPanelPorts: "12",
      campusLocations: "2",
      protocol: "Ethernet",
    },
  },
};
