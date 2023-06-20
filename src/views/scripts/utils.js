export const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const getUrlParams = () => {
  const currentUrl = window.location.href;
  const page_url = new URL(currentUrl);
  const params = new URLSearchParams(page_url.search);
  return params;
};
