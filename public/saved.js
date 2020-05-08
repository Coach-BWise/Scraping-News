$(document).ready(function () {
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  initPage();

  function initPage() {
    $("#articles").empty();

    $.getJSON("/articles?saved=true", function (data) {
      // For each one

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
      // Display the articles information on the page
      artPanels.push(createPanel(data[i]));
    }
    $("#articles").append(artPanels);
  }
  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class= 'alert alert-warning text-center'>",
        "<h4>No saved Articles</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>You Can...</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Scrape for New Articles</a></h4>",
        "<h4><a href='/'>Browse Articles</a></h4>",
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
        "<a class='btn delete'>",
        "<i class='fa fa-floppy-o fa-lg' aria-hidden='true'><span id='deleteFloppy' class='tooltiptext'>Delete From Saved</span></i>",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        "<a class='btn btn-info' href='" + article.link + "'>View Article",
        "</a>",
        "<a class='btn btn-info notes'>Article Notes",
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

  function handleArticleDelete() {
    var articleToDelete = $(this).parents(".panel").data();

    $.ajax({
      method: "DELETE",
      url: "/articles" + articleToDelete._id,
    }).then(function (data) {
      //this data obj {n:1, ok:1, deletedCount:1} from router.delete
      if (data.ok) {
        console.log(data);
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    var currentArticle = $(this).parents(".panel").data(); //article id

    $.get("/comments" + currentArticle._id).then(function (data) {
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>",
      ].join("");

      bootbox.dialog({
        message: modalText,
        closeButton: true,
      });

      var noteData = {
        _id: currentArticle._id,
        notes: data || [],
      };

      $(".btn.save").data("article", noteData);

      renderNotesList(noteData);
    });
  }

  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;

    if (!data.notes.length) {
      currentNote = [
        "<li class='list-group-item'>",
        "No notes for this article, yet.",
        "</li>",
      ].join("");
      notesToRender.push(currentNote);
    } else {
      data.notes.forEach((element) => {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            element.commentText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>",
          ].join("")
        );
        currentNote.children("button").data("_id", element._id);

        notesToRender.push(currentNote);
      });
    }
    $(".note-container").append(notesToRender);
  }

  function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();

    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        commentText: newNote,
      };
      $.post("comments", noteData).then(function () {
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    var notesToDelete = $(this).data("_id");
    console.log();

    $.ajax({
      url: "comments" + notesToDelete,
      method: "Delete",
    }).then(function () {
      bootbox.hideAll();
    });
  }
});
