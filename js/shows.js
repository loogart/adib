$.ajax({
    url: "https://phaneuf.ca/api/spectacles/julien-lacroix?callback=myJsonpCallback",
    dataType: "jsonp",
    type: "POST",
    jsonpCallback: 'processJSONPResponse',
    contentType: "application/json; charset=utf-8",
    success: function (result, status, xhr) {
        console.log(result);
        // créer le html
        
    },
    error: function (xhr, status, error) {
        console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
});
