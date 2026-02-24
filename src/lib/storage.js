const CART_KEY = 'nike_cart';
const AUTH_KEY = 'nike_auth';

export const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const loadAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveAuth = (data) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};