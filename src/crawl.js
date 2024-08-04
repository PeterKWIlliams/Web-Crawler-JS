const normalizeURL = (url) => {
  const urlObj = new URL(url);
  let cleanPath = urlObj.pathname;
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }
  if (cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }
  return cleanPath ? `${urlObj.hostname}/${cleanPath}` : urlObj.hostname;
};

export { normalizeURL };
