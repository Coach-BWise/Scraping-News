$(document).ready(function () {
  // Grab the articles as a json
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    console.log("init");
    $("#articles").empty();

    $.getJSON("/articles?saved=false", function (data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(data) {
    var artPanels = [];
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      artPanels.push(createPanel(data[i]));
    }
    $("#articles").append(artPanels);
  }
  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class= 'alert alert-warning text-center'>",
        "<h4>No new Articles</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>You Can...</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Scrape for New Articles</a></h4>",

        "</div>",
        "</div>",
      ].join("")
    );
    $("#articles").append(emptyAlert);
  }

  function createPanel(article) {
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.title,
        "<a class='btn save'>",
        "<i class='fa fa-floppy-o fa-lg' aria-hidden='true'><span class='tooltiptext'>Save Article</span></i>",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",

        "<p><a href='" + article.link + "'>View Article",
        "</a></p>",
        "<p>",
        article.topic,
        "</p>",
        "<p style='color: white'>",
        article.time,
        "</p>",
        "</div>",
        "</div>",
      ].join("")
    );

    panel.data("_id", article._id);

    return panel;
  }

  function handleArticleSave() {
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    $.ajax({
      method: "PATCH",
      url: "/articles",
      data: articleToSave,
    }).then(function () {
      initPage();
    });
  }

  function handleArticleScrape() {
    $.get("/scrape", function (data) {
      initPage();

      bootbox.alert(
        "<h3 class='text-center m-top-80'>" + data.message + "</h3>"
      );
    });
  }
});
