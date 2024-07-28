import Image from '@11ty/eleventy-img'
import markdownIt from 'markdown-it'
import PageMetadata from './components/PageMetadata.js'

Image.concurrency = 100;

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true
})

export default function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");

  eleventyConfig.addFilter("markdown", function(value) {
    return md.render(value);
  });

  eleventyConfig.addShortcode("image", async function (src, alt, sizes) {
		try {
      let metadata = await Image(src, {
        widths: [300],
        formats: ["webp", "jpeg"],
      });

      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      };

      return Image.generateHTML(metadata, imageAttributes);
    } catch (error) {
      console.log(error);
      return `<img width=300 src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
    }
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
