var metalsmith        = require('metalsmith'),
    markdown          = require('metalsmith-markdown'),
    drafts            = require('metalsmith-drafts'),
    layouts           = require('metalsmith-layouts'),
    permalinks        = require('metalsmith-permalinks'),
    collections       = require('metalsmith-collections'),
    handlebars        = require('handlebars'),
    metallic          = require('metalsmith-metallic'),
    serve             = require('metalsmith-serve'),
    watch             = require('metalsmith-watch');

handlebars.registerHelper('moment', require('helper-moment'));

// limit an array to a maximum of elements (from the start)
// Thanks to http://stackoverflow.com/questions/10377700/limit-results-of-each-in-handlebars-js
handlebars.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Neustadt.fr',
      baseurl: 'https://www.neustadt.fr',
      author: 'Parimal Satyal',
      keywords: 'Neustadt, parimalsatyal, Parimal Satyal',
      description: 'Neustadt.fr is Paris-based designer Parimal Satyal\'s collection of essays, reviews and music.'
    }
  })
  .source('./src')
  .destination('./public')
  .use(drafts())
  .use(collections({
    publications: {
      pattern: '*/**/*.md',
      sortBy: 'date',
      reverse: true,
      metadata: {
        name: 'Everything'
      }
    },
    essays: {
      pattern: 'essays/**/*.md',
      sortBy: 'date',
      reverse: true,
      metadata: {
        name: 'Essays'
      }
    },
    reviews: {
      pattern: 'reviews/**/*.md',
      sortBy: 'date',
      reverse: true,
      metadata: {
        name: 'Reviews'
      }
    }
  }))
  .use(metallic())
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './layout',
    pattern: ["*/*/*html","*/*html","*html"],
    default: 'essay.html',
    partials: {
            header: 'partials/header',
            footer: 'partials/footer'
        }
  }))
  .use(serve({
    port: 8081,
    verbose: true
  }))
  .use(watch({
      paths: {
        "${source}/**/*": true,
        "layout/**/*": "**/*",
      }
    }))
    .build(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Neustadt.fr built!');
      }
    });
