const markdownIt = require("markdown-it")
const htmlmin = require("html-minifier")
const path = require('path')
const fs = require('fs')
const sharp = require("sharp");

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
    'gif',
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


  /* Preview Image Generator */
  // https://github.com/manustays/eleventy-plugin-generate-social-images/blob/main/utils/generateSocialImage.js
  function wrapTitle(title, rowLength = 23, maxRows = 3) {
    let title_rows = [];
    words = title.split(/(?<=[^a-zA-Z0-9()<>""''])/);
    let _row = '';
    words.forEach((wrd) => {
      if (_row.length + wrd.length >= rowLength) {
        title_rows.push(_row);
        _row = '';
      }
      _row += wrd;
    });
    if (_row) {
      title_rows.push(_row);
    }
  
    // Limit rows...
    if (title_rows.length > maxRows) {
      title_rows.length = maxRows;
      title_rows[maxRows-1] += "…";
    }
  
    return title_rows;
  }

  function sanitizeHTML(text) {
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function translateNetIDtoName(netid) {
    switch (netid) {
      case "waf": return "Prof. Wade Fagen-Ulmschneider";
      case "kennel2": return "Jackson Kennel";
      default:
        console.warn(`Missing \`translateNetIDtoName\` in .eleventy.js for: ${netid}`);
        return netid;
    }
  }

  fs.mkdirSync("public/static/preview/", { recursive: true });
  let authorImageCache = {};

	eleventyConfig.addAsyncShortcode("GenerateSocialImage", async function () {
    let {page, title, permalink, tags, isFuturePage, authors} = this.ctx;

    if (!title || title.length == 0 || isFuturePage) { 
      return "";
    }

    // Check if it exists
    let imageName = page.url.replace(/\//g, '_');
    imageName = imageName.substring(1, imageName.length - 1) + '.png';
    let localPath = `public/static/preview/${imageName}`;
    let urlPath = `https://https://systems-encyclopedia.cs.illinois.edu/static/preview/${imageName}`;

    if (fs.existsSync(localPath)) {
      //return urlPath;
    }


    let start_x = 40;
    let start_y = 200;
    let line_height = 90;

    // Create <text> elements for the post title:
    let svg_title = "";
    let title_rows = wrapTitle(title);
    for (let i = 0; i < title_rows.length; i++) {
      title_piece = sanitizeHTML(title_rows[i]);
      svg_title += `<text x="${start_x}" y="${start_y + (i * line_height)}" fill="#DD3403" font-size="80px" font-weight="700">${title_piece}</text>`;
    }

    start_y += (title_rows.length * line_height) - 10;


    if (!authors) {
      authors = ["waf"];
    }

    let svg_by = "";
    let author_images = [];

    if (authors.length > 0) {
    }

    for (let i = 0; i < authors.length; i++) {
      let author = authors[i];

      if (i == 0) {
        svg_by += `<text x="${start_x}" y="${start_y}" fill="#13294B" font-size="50px" font-weight="700">w/</text>`;
      } else {
        svg_by += `<text x="${start_x + 30}" y="${start_y}" fill="#aaa" font-size="50px" font-weight="700">+</text>`;
      }

      svg_by += `<circle cx="${start_x + 70 + 25}" cy="${start_y - 45 + 25}" r="27" fill="#13294B" />`;
      svg_by += `<text x="${start_x + 130}" y="${start_y}" fill="#13294B" font-size="50px" font-weight="700">${translateNetIDtoName(author)}</text>`;
  
      author_images.push({ x: start_x + 70, y: start_y - 45, author: author });
      start_y += 60;

      if (i == 0) {
        start_x += 40;
      }
    }


    /*
    let svg_category = "";
    if (!tags)  {
      // No text
    } else if (tags.includes("guides")) {
      svg_category += `<text x="50" y="155" fill="white" font-size="70px" font-weight="700">Data Science Guide</text>`;
    } else if (tags.includes("learn")) {
      svg_category += `<text x="50" y="155" fill="white" font-size="70px" font-weight="700">Lecture Notes</text>`;
    } else if (tags.includes("dataset")) {
      svg_category += `<text x="50" y="155" fill="white" font-size="70px" font-weight="700">Dataset</text>`;
    }
    */



    // Create the SVG:
    let svg = `
    <svg width="1200" height="630" viewbox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <g style="font-family: Archivo;">
      ${svg_title}
      ${svg_by}
    </g>
    </svg>`;

    // Save the image:
		const svgBuffer = Buffer.from(svg);
    
		const svgText = await sharp(svgBuffer)
			.resize(1200, 630)
      .toBuffer();

    
    let composite_author_images = [];
    for (let author_image of author_images) {
      if (!authorImageCache[author_image.author]) {
        let authorPhotoPath = `src/static/staff/${author_image.author}.jpg`;

        let author50px;
        if (fs.existsSync(authorPhotoPath)) {
          author50px = await sharp(`src/static/staff/${author_image.author}.jpg`)
          .resize({ width: 50, height: 50, fit: "contain" })
          .toBuffer();  
        } else {
          author50px = await sharp(`src/static/staff/missing.svg`)
          .resize({ width: 50, height: 50, fit: "contain" })
          .toBuffer();
        }

        authorImageCache[author_image.author] = await sharp(Buffer.from(`<svg height="50" width="50"><circle cx="25" cy="25" r="25" fill="white"/></svg>`))
        .composite([{ input: author50px, blend: "in" }])
        .toBuffer();
      }

      composite_author_images.push({
        input: authorImageCache[author_image.author],
        left: author_image.x,
        top: author_image.y,
      })
    }

    const background = await sharp("preview-template.png")
			.composite([
        { input: svgText, top: 0, left: 0 },
        ...composite_author_images
      ])
      .png()
			.toFile(localPath);

    return urlPath;
  })  

  return eleventyConfig;
}
