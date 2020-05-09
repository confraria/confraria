const toml = require("toml");
module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addDataExtension("toml", (contents) => {
    const a = toml.parse(contents);
    return a;
  });
  return {
    jsDataFileSuffix: ".data",
    passthroughFileCopy: true,
  };
};
