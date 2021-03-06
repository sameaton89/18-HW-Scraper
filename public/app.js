// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = data.length - 1; i >= 0; i--) {
    // Display the apropos information on the page
    $("#articles").append("<h3><p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</h3><a href='" + data[i].link + "'>" + data[i].link + "</a></p>");
  }
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
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
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId})
        // With that done, add the note information to the page
        .then(function(data) {
          console.log(data);
          // Now open the modal! (Assuming you are using bootstrap.js)
          $("#notes-modal").modal("show");
          // If you used 'res.json' then you can use yourData here
          $("#notes-modal-body").html(data);
    
          // The title of the article
          $("#notes-modal-title").html("<h2>" + data.title + "</h2>");
          // An input to enter a new title, textarea for comment, submit button
          $("#notes-modal-body").html("<div class='form-group'><label for='title'><b>Title</b></label><input type='text' class='form-control' id='titleinput' name='title'></div><br><b>Comment</b><div class='form-group'><textarea class='form-control' rows='5' id='bodyinput' name='body'></textarea></div><br><button data-id='" + data._id + "' type='button' class='btn btn-primary' id='savenote'>Save Note</button>");

    
    
    
          // If there's a note in the article
          if (data.note) {
            // Place the title of the note in the title input
            // $("#notes-modal-body").append("<p><b>" + data.note[0].title + "</p></b>" + data.note[0].body);
    
            for (var i = 0; i < data.note.length ; i++) {
              $("#notes-modal-body").prepend("<p data-id=" +
              data.note[i]._id + "><b>" + data.note[i].title + "</b><br>" + data.note[i].body + " <span class='delete'>X</span></p>")}
    
          }
    
        });


    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#scrape", function() {
  event.preventDefault;
  $.ajax({
      method: "GET",
      url: "/scrape" // Modify the url according to your application logic
  }).done(function(yourData) {
    console.log(yourData);
      // Now open the modal! (Assuming you are using bootstrap.js)
      $("#scrape-modal").modal("show");
      // If you used 'res.json' then you can use yourData here
      $("#scrape-modal-body").html(yourData);
  });
});

$(document).on("click", "#show-dat", function() {
  // $.ajax({
  //   method: "GET",
  //   url: "/articles"
  // }).then(function(response) {
  //   console.log(response);
  // });
  $("#articles").empty();
  $.getJSON("/articles", function(data) {
  // For each one
  for (var i = data.length - 1; i >= 0; i--) {
    // Display the apropos information on the page
    $("#articles").append("<h3><p class='title' data-id='" + data[i]._id + "'>" + data[i].title + "</h3><a href='" + data[i].link + "'>" + data[i].link + "</a></p>");
    }
  });
});

// Whenever someone clicks a p tag
$(document).on("click", ".title", function() {
  // Empty the notes from the note section
  // $("#notes-modal").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // Now open the modal! (Assuming you are using bootstrap.js)
      $("#notes-modal").modal("show");
      // If you used 'res.json' then you can use yourData here
      $("#notes-modal-body").html(data);

      // The title of the article
      $("#notes-modal-title").html("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes-modal-body").html("<div class='form-group'><label for='title'><b>Title</b></label><input type='text' class='form-control' id='titleinput' name='title'></div><br><b>Comment</b><div class='form-group'><textarea class='form-control' rows='5' id='bodyinput' name='body'></textarea></div><br><button data-id='" + data._id + "' type='button' class='btn btn-primary' id='savenote'>Save Note</button>");


      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        // $("#notes-modal-body").append("<p><b>" + data.note[0].title + "</p></b>" + data.note[0].body);

        for (var i = 0; i < data.note.length ; i++) {
          $("#notes-modal-body").prepend("<p data-id=" +
          data.note[i]._id + "><b>" + data.note[i].title + "</b><br>" + data.note[i].body + " <span class='delete' data-id=" +
          data.note[i]._id + ">X</span></p>")}

      }

    });
});


// When user clicks the delete button for a note
$(document).on("click", ".delete", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/articles/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#note").val("");
      $("#title").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});