const printReport = (pages) => {
  const sortedKeys = Object.keys(pages).sort((a, b) => pages[a] - pages[b]);
  for (const key of sortedKeys) {
    console.log(`Found ${pages[key]} internal links to ${key}`);
  }
};

export { printReport };
