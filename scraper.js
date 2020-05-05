var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function (cb) {
  axios.get("https://www.tampabay.com/news").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    var arr = [];

    // Now, we grab every h2 within an article tag, and do the following:
    $(".feed-item .story-item").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).find("a").text();
      result.link = "https://tampabay.com" + $(this).find("a").attr("href");
      result.topic = $(this).find(".sectionbullet").text().trim();
      result.time = $(this).find(".timestamp").text();

      // Create a new Article using the `result` object built from scraping

      arr.push(result);
    });
    cb(arr);
  });
};

module.exports = scrape;
