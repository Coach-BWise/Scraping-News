$(document).ready(function () {
  // Grab the articles as a json
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    $("#articles").empty();
    console.log("init");

    $.getJSON("/articles", function (data) {
      // For each one

      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  // Whenever someone clicks a p tag
  $(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append(
          "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
        );

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val(),
      },
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and text area for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

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
        "<h4><a href='/saved'>See Saved Articles</a></h4>",
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
        "<a href='article.link'>View Article",
        "</a>",
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
    }).then(function (data) {
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/scrape").then(function (data) {
      initPage();
      bootbox.alert(
        "<h3 class='text-center m-top-80'>" + data.message + "</h3>"
      );
    });
  }
});
