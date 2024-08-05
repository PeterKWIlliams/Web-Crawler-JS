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

const fetchHtml = async (url) => {
  const response = await fetch(url);
  if (response.status >= 400) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    console.log(contentType, "this is the content type");
    throw new Error(`Content is not HTML this is the url${url}`);
  }
  return response.text();
};

const crawlPage = async (baseURL, currentURL = baseURL, pages = {}) => {
  const currentUrlObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);
  if (currentUrlObj.hostname !== baseURLObj.hostname) {
    return pages;
  }
  const normalizedURL = normalizeURL(currentURL);
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL] += 1;
    return pages;
  } else {
    pages[normalizedURL] = 1;
  }
  let html = "";
  try {
    html = await fetchHtml(currentURL);
  } catch (err) {
    console.log(`${err.message} hit not something that is html`);
  }
  try {
    const urls = getURLsFromHTML(html, baseURL);
    urls.forEach(async (url) => {
      pages = await crawlPage(baseURL, url, pages);
    });
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }

  return pages;
};
export { normalizeURL, getURLsFromHTML, crawlPage };
