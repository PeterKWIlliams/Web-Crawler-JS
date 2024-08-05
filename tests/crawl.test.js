import { test, expect } from "@jest/globals";
import { getURLsFromHTML, normalizeURL } from "../src/crawl.js";

describe("normalizeURL", () => {
  const testCases = [
    {
      name: "removes protocol (https)",
      input: "https://www.example.com",
      expected: "www.example.com",
    },
    {
      name: "removes trailing slash",
      input: "https://www.example.com/",
      expected: "www.example.com",
    },
    {
      name: "lowercases hostname",
      input: "https://www.EXAMPLE.com/",
      expected: "www.example.com",
    },
    {
      name: "removes protocol (http)",
      input: "http://www.example.com",
      expected: "www.example.com",
    },
    {
      name: "keeps path",
      input: "https://www.google.com/search",
      expected: "www.google.com/search",
    },
    {
      name: "removes trailing slash in path",
      input: "https://www.youtube.com/watch/",
      expected: "www.youtube.com/watch",
    },
    {
      name: "lowercases hostname with path",
      input: "https://WWW.GOOGLE.com/maps",
      expected: "www.google.com/maps",
    },
    {
      name: "removes protocol (http) and lowercases hostname with path",
      input: "http://YOUTUBE.com/channel",
      expected: "youtube.com/channel",
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    test(`normalizeURL ${name}`, () => {
      expect(normalizeURL(input)).toBe(expected);
    });
  });
});

describe("getURLsFromHTML", () => {
  test("getsURLsFromHTML single anchor tag", () => {
    const htlmBody = `
<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
    </body>
</html>
  `;
    const expected = ["https://blog.boot.dev/"];
    expect(getURLsFromHTML(htlmBody)).toEqual(expected);
  });

  test("getsURLsFromHTML multiple anchor tags", () => {
    const htlmBody = `
<html>
    <body>
        <a href="https://www.google.dev"><span>Go to Boot.dev</span></a>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
    </body>
</html>
  `;
    const expected = [
      "https://www.google.dev/",
      "https://blog.boot.dev/",
      "https://blog.boot.dev/",
    ];
    expect(getURLsFromHTML(htlmBody)).toEqual(expected);
  });

  test("getsURLsFromHTML relative redirect", () => {
    const baseUrl = "https://www.google.com";
    const htlmBody = `
  <html>
      <body>
          <a href="/locations/hello/when"><span>Go to Boot.dev</span></a>
          <a href="/help/then/one"><span>Go to Boot.dev</span></a>
      </body>
  </html>
    `;
    const expected = [
      "https://www.google.com/locations/hello/when",
      "https://www.google.com/help/then/one",
    ];
    console.log(
      getURLsFromHTML(htlmBody, baseUrl),
      "this is waht im looking for",
    );
    expect(getURLsFromHTML(htlmBody, baseUrl)).toEqual(expected);
  });

  test("getsURLsFromHTML no href", () => {
    const htlmBody = `
  <html>
      <body>
          <a><span>Go to Boot.dev</span></a>
      </body>
  </html>
    `;
    const expected = [];
    console.log(getURLsFromHTML(htlmBody), "thsi is waht i m lookign for");
    expect(getURLsFromHTML(htlmBody, "")).toEqual(expected);
  });
});
