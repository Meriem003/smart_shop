import { TVA_RATE, LOYALTY_DISCOUNTS, PROMO_DISCOUNT_RATE, LOYALTY_TIERS } from './constants';

export const roundToTwoDecimals = (amount) => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return 0;
  }
  return Math.round(amount * 100) / 100;
};

export const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 0;
  }
  
  const subtotal = items.reduce((total, item) => {
    const price = Number.parseFloat(item.price || item.prix || 0);
    const quantity = Number.parseInt(item.quantity || item.quantite || 0, 10);
    return total + (price * quantity);
  }, 0);
  
  return roundToTwoDecimals(subtotal);
};

export const calculateLoyaltyDiscount = (subtotal, tier) => {
  if (!subtotal || subtotal <= 0) return 0;
  
  const discountRate = LOYALTY_DISCOUNTS[tier] || LOYALTY_DISCOUNTS[LOYALTY_TIERS.BASIC];
  return roundToTwoDecimals(subtotal * discountRate);
};

export const calculatePromoDiscount = (subtotal, promoValid) => {
  if (!subtotal || subtotal <= 0 || !promoValid) return 0;
  return roundToTwoDecimals(subtotal * PROMO_DISCOUNT_RATE);
};

export const calculateTotalDiscount = (loyaltyDiscount, promoDiscount) => {
  return roundToTwoDecimals((loyaltyDiscount || 0) + (promoDiscount || 0));
};

export const calculateTaxableAmount = (subtotal, totalDiscount) => {
  const taxable = (subtotal || 0) - (totalDiscount || 0);
  return roundToTwoDecimals(Math.max(0, taxable));
};

export const calculateTVA = (taxableAmount, rate = TVA_RATE) => {
  if (!taxableAmount || taxableAmount <= 0) return 0;
  return roundToTwoDecimals(taxableAmount * rate);
};

export const calculateTotalTTC = (taxableAmount, tva) => {
  return roundToTwoDecimals((taxableAmount || 0) + (tva || 0));
};

export const calculateOrderTotals = (items, loyaltyTier = LOYALTY_TIERS.BASIC, hasValidPromo = false) => {
  const subtotal = calculateSubtotal(items);
  const loyaltyDiscount = calculateLoyaltyDiscount(subtotal, loyaltyTier);
  const promoDiscount = calculatePromoDiscount(subtotal, hasValidPromo);
  const totalDiscount = calculateTotalDiscount(loyaltyDiscount, promoDiscount);
  const taxableAmount = calculateTaxableAmount(subtotal, totalDiscount);
  const tva = calculateTVA(taxableAmount);
  const totalTTC = calculateTotalTTC(taxableAmount, tva);

  return {
    subtotal,
    loyaltyDiscount,
    promoDiscount,
    totalDiscount,
    taxableAmount,
    tva,
    totalTTC,
  };
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
