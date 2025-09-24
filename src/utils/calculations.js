export const calculatePrice = (product, configuration) => {
  let price = product.basePrice;

  // Add pricing logic based on configuration
  if (configuration.power && !isNaN(configuration.power)) {
    price += parseInt(configuration.power) * 50;
  }

  if (configuration.bandwidth && !isNaN(configuration.bandwidth)) {
    price += parseInt(configuration.bandwidth) * 0.1;
  }

  if (configuration.cabinetSize) {
    switch (configuration.cabinetSize) {
      case "Full Rack":
        price += 200;
        break;
      case "Half Rack":
        price += 100;
        break;
      case "Quarter Rack":
        price += 50;
        break;
    }
  }

  if (configuration.speed) {
    switch (configuration.speed) {
      case "100G":
        price += 500;
        break;
      case "10G":
        price += 200;
        break;
      case "1G":
        price += 50;
        break;
    }
  }

  return Math.round(price);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
