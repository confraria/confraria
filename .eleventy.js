const toml = require('toml');
module.exports = eleventyConfig => {
  eleventyConfig.addDataExtension('toml', contents => {
    const a = toml.parse(contents);
    return a;
  });
}
