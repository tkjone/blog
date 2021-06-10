const fs = require("fs");

const filter = require("./src/filter");

// @note import plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");

const svgContents = require("eleventy-plugin-svg-contents");

// @note custom markdown parsing
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginMarkdownTOC = require("eleventy-plugin-toc");

const mdOptions = {
  html: true,
};

const mdAnchorOpts = {
  permalink: true,
  permalinkClass: "anchor-link",
  permalinkSymbol: "#",
  level: [2],
};

module.exports = function (eleventyConfig) {
  // @configuration avoid using .gitignore to tell eleventy what should/should
  // not be watched
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");

  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addFilter("dateFilter", filter.dateFilter);

  eleventyConfig.addFilter("w3cDate", filter.w3cDate);

  // @configuration rock an RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // @configuration inline SVG
  eleventyConfig.addPlugin(svgContents);

  eleventyConfig.addPlugin(pluginMarkdownTOC);

  // @configuration add custom markdown parsing library
  eleventyConfig.setLibrary(
    "md",
    markdownIt(mdOptions).use(markdownItAnchor, mdAnchorOpts)
  );

  // Override Browsersync defaults (used only with --serve)
  // ---------------------------------------------------------------------------
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("./dist/404.html");
          // Add 404 http status code in request header.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
  };
};
