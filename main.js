import { argv } from "node:process";
import { crawlPage } from "./src/crawl.js";
import { printReport } from "./src/report.js";
async function main() {
  try {
    if (argv.length < 3) {
      throw new Error("Missing required argument: <url>");
    }
    if (argv.length > 3) {
      throw new Error("Too many arguments command requests one: <url>");
    }

    const url = argv[2];
    try {
      new URL(url);
    } catch {
      throw new Error("Invalid URL");
    }
    const html = await crawlPage(url);
    printReport(html);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
}
main();
