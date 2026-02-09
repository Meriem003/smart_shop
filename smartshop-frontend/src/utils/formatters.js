export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '0.00 DH';
  }
  return `${Number.parseFloat(amount).toFixed(2)} DH`;
};

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0%';
  }
  return `${(value * 100).toFixed(0)}%`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replaceAll(/\D/g, '');
  const regex = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
  const match = regex.exec(cleaned);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  return phone;
};
