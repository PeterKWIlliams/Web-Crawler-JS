import { JSDOM } from "jsdom";
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
const getURLsFromHTML = (htmlBody, baseUrl) => {
  const domCopy = new JSDOM(htmlBody);
  const anchorTags = domCopy.window.document.querySelectorAll("a");
  const hrefs = [];
  for (const anchor of anchorTags) {
    if (anchor.hasAttribute("href")) {
      let href = anchor.href;
      try {
        href = new URL(href, baseUrl).href;
        hrefs.push(href);
      } catch (err) {
        console.log(`${err.message}:${href}`);
      }
    }
  }
  return hrefs;
};
