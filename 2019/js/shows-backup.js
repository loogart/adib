const app = document.getElementById('root')

//const logo = document.createElement('img')
//logo.src = 'logo.png'

const container = document.createElement('div')
container.setAttribute('class', 'div')

//app.appendChild(logo)
app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true)
request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
        data.forEach(movie => {
            const show = document.createElement('div')
            show.setAttribute('class', 'spectacle')

            const titre = document.createElement('h4')
            titre.setAttribute('class', 'info')
            titre.textContent = movie.title

            const date = document.createElement('h5')
            date.setAttribute('class', 'date')
            date.textContent = movie.release_date

            const location = document.createElement('h5')
            location.setAttribute('class', 'info')
            location.textContent = movie.rt_score


            const tickets = document.createElement('a')
            tickets.textContent = "Buy Tickets"
            tickets.setAttribute('class', 'btn btn-lg btn-custom-2')
            tickets.setAttribute('href', movie.url)
            tickets.setAttribute('target', '_blank')


            container.appendChild(show)
            show.appendChild(titre)
            show.appendChild(date)
            show.appendChild(location)
            show.appendChild(tickets)
        })
    } else {
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `Gah, it's not working!`
        app.appendChild(errorMessage)
    }
}

request.send()
