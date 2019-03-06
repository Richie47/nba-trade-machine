var selectedTeams = []
window.onload = function () {
    var teams = document.getElementsByTagName('button');
    console.log("Hello")

    for (team in teams) {
        teams[team].onclick = function () {
            console.log(this.innerText)
            if (this.classList.contains('selected')) {
                selectedTeams.splice(selectedTeams.indexOf(this.innerText), 1)
                this.classList.remove('selected')
                checkExceededLimit()

            } else {
                selectedTeams.push(this.innerText)

                this.className += ' selected'
                checkExceededLimit()
            }
            console.log(selectedTeams)
        }
    }
}

var checkExceededLimit = () => {
    if (selectedTeams.length > 4) {
        document.getElementById('errormessage').innerText = `You have too many Teams selected(${selectedTeams.length} teams).\n Please choose four or less`
    } else {
        document.getElementById('errormessage').innerText = `${selectedTeams.length} Team${ (selectedTeams.length!=1) ? 's':""} Selected`
    }
}