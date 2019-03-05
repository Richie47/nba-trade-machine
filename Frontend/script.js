window.onload = function () {
    var teams = document.getElementsByTagName('button');
    console.log("Hello")
    var selectedTeams = []
    for (team in teams) {
        teams[team].onclick = function () {
            console.log(this.innerText)
            if (this.classList.contains('selected')) {
                selectedTeams.splice(selectedTeams.indexOf(this.innerText), 1)
                this.classList.remove('selected')
            } else {
                selectedTeams.push(this.innerText)

                this.className += ' selected'
            }K
            console.log(selectedTeams)
        }
    }
}