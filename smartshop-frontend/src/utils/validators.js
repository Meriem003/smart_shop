import { CASH_PAYMENT_LIMIT, PAYMENT_TYPES } from './constants';

export const validatePromoCode = (code) => {
  if (!code || typeof code !== 'string') return false;
  const promoCodeRegex = /^PROMO-[A-Z0-9]{4}$/;
  return promoCodeRegex.test(code.toUpperCase());
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStock = (quantity, available) => {
  if (quantity <= 0) {
    return {
      isValid: false,
      message: 'La quantité doit être supérieure à 0',
    };
  }
  if (quantity > available) {
    return {
      isValid: false,
      message: `Stock insuffisant. Disponible: ${available}`,
    };
  }
  return {
    isValid: true,
    message: '',
  };
};

export const validatePaymentAmount = (amount, type) => {
  if (!amount || amount <= 0) {
    return {
      isValid: false,
      message: 'Le montant doit être supérieur à 0',
    };
  }

  if (type === PAYMENT_TYPES.ESPECES && amount > CASH_PAYMENT_LIMIT) {
    return {
      isValid: false,
      message: `Le paiement en espèces est limité à ${CASH_PAYMENT_LIMIT} DH`,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^(0|\+212)[5-7]\d{8}$/;
  return phoneRegex.test(phone.replaceAll(/\s/g, ''));
};

export const validateRequired = (obj, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach((field) => {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      errors[field] = 'Ce champ est requis';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
