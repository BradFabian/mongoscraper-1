// Whenever someone clicks the Save Article button
$(document).on("click", "#savearticle", function() {
    // Grab the id associated with the article from the save article button
    var thisId = $(this).attr("data-id");

    // Run a POST request to add the article to /saved
    $.ajax({
        method: "POST",
        url: "/saved" + thisId,
        data: {
            title: title,
            link: link
        }
    })
    
    // With that done
    .then(function(data) {
        console.log(data);
    })
})