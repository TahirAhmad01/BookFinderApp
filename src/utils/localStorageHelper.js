export const getLocalStorageItem = (key, defaultValue = []) => {
  return JSON.parse(localStorage.getItem(key)) || defaultValue;
};

export const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
