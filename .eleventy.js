import markdownIt from 'markdown-it'
import PageMetadata from './components/PageMetadata.js'

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true
})

export default function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");

  eleventyConfig.addFilter("markdown", function(value) {
    return md.render(value)
  });
  eleventyConfig.addShortcode("PageMetadata", PageMetadata);

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
      "11ty.js"
    ],

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: "./site",
      includes: "_includes",
      data: "_data",
      output: "dist"
    }
  };
}
