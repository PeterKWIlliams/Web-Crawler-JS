import { test, expect } from "@jest/globals";
import { normalizeURL } from "../src/crawl.js";

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
