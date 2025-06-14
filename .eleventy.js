import * as  sass from "sass";
import fs from "fs";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import yaml from "js-yaml";

export default function(eleventyConfig) {

  // Extension to load YAML Files
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Sanity check for if data is loaded
  eleventyConfig.on("afterBuild", () => {
    console.log("Data loaded:", JSON.stringify(eleventyConfig.dataExtensions, null, 2));
  });

  // Sass compile step
  eleventyConfig.on("afterBuild", () => {
    const result = sass.compile("_sass/main.scss", { style: "compressed" });
    fs.writeFileSync("_site/assets/css/style.css", result.css);
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("assets");

  // Global data
  return {
    dir: {
      output: "_site",
      includes: "_includes",  // For partials like head, footer, etc.
      layouts: "_layouts", // Explicitly set layouts folder
      data: "_data"
    },
    templateFormats: ["html", "md"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    passthroughFileCopy: true,
    pathPrefix: "/"
  };
};
