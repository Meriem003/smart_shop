const STORAGE_PREFIX = 'smartshop_';

export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage:', error);
  }
};

export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return defaultValue;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du localStorage:', error);
  }
};

export const clearAll = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Erreur lors du nettoyage du localStorage:', error);
  }
};

export const hasItem = (key) => {
  return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
};

export const STORAGE_KEYS = {
  CART: 'cart',
  USER_PREFERENCES: 'user_preferences',
  LAST_SEARCH: 'last_search',
  PAGE_SIZE: 'page_size',
};
