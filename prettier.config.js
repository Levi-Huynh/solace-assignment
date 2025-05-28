module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  proseWrap: "preserve",
  endOfLine: "auto",
  overrides: [
    {
      files: ["*.json", "*.yml", "*.yaml"],
      options: { tabWidth: 2, singleQuote: false },
    },
    {
      files: ["*.md", "*.mdx"],
      options: { proseWrap: "always" },
    },
  ],
};
