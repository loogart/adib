$.ajax({
    url: "https://phaneuf.ca/api/spectacles/adib-alkhalidey?callback=myJsonpCallback",
    dataType: "jsonp",
    type: "POST",
    jsonpCallback: 'processJSONPResponse',
    contentType: "application/json; charset=utf-8",
    success: function (result, status, xhr) {
        var app = document.getElementById('root') 

        var container = document.createElement('div')
        container.setAttribute('class', 'div')
        app.appendChild(container)

        for(var i = 0; i < result.spectacles.length; i++) {
            var spectacle = result.spectacles[i];
            var show = document.createElement('div');
            show.setAttribute('class', 'spectacle')
               
            var titre = document.createElement('h4');      
            titre.setAttribute('class', 'info')   
            titre.textContent = spectacle.name
       
            var date = document.createElement('h5')
            date.setAttribute('class', 'date')
            date.textContent = spectacle.full_date
       
            var location = document.createElement('h5')
            location.setAttribute('class', 'info')
            location.textContent = spectacle.ville    
       
       
            var tickets = document.createElement('a')
            tickets.textContent = "Billets"
            tickets.setAttribute('class', 'btn btn-lg btn-custom-2')
            tickets.setAttribute('href', spectacle.url)
            tickets.setAttribute('target', '_blank')
        

            container.appendChild(show)
            show.appendChild(titre)
            show.appendChild(date)
            show.appendChild(location)
            show.appendChild(tickets)
        }
    },
    error: function (xhr, status, error) {
        console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    }
});
