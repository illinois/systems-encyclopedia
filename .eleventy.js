const markdownIt = require("markdown-it")
const htmlmin = require("html-minifier")
const path = require('path')
const fs = require('fs')

const isProduction = process.env.NODE_ENV === 'production'
const slugify = require('slugify')
const { fstat } = require("fs")
const slugify_opts = {
  strict: true,
}


module.exports = function(eleventyConfig) {
  // Static Syntax Highlighting Plugin
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/static");

  eleventyConfig.markdownTemplateEngine = 'njk'
  //eleventyConfig.markdownTemplateEngine = 'liquid'

  eleventyConfig.dir = {
    input: './src',
    output: "./public"
  }

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.setTemplateFormats([
    'njk',
    'md',
    'jpg',
    'png',
    'js',
    'csv',
    'html',
    'css',
    // 'svg',
    // 'liquid',
    // 'pug',
    // 'ejs',
    // 'hbs',
    // 'mustache',
    // 'haml',
    // '11ty.js',
  ])

  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  }

  md_lib = markdownIt(markdownItOptions)
  .disable('code')
  .use(require('markdown-it-attrs'))
  .use(require('markdown-it-anchor'), {
    slugify: (s) => slugify(s, slugify_opts)
  })

  
  eleventyConfig.setLibrary("md", md_lib)

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(isProduction && outputPath.endsWith(".html")){
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })

      return minified
    }

    return content
  })

  eleventyConfig.addFilter("slugify", (content) => {
    return slugify(content, slugify_opts);
  });

  eleventyConfig.addPairedShortcode("output", function(content) {
    return `<pre class="code-output-block">${content}</pre>`;
  });

  return eleventyConfig
}
