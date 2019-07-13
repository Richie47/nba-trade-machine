
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

//Doesn't use data now, but left it as someday this will be the case, and it doesn't affect anything for this demo.
function generatePlayerTableHead(table, data){
    let thead = table.createTHead();
    let row = thead.insertRow();
    //so here I am only using 3 columns, while the JSON file has a lot more. Meaning if we looped through the JSON file it would have more information
    //then my roster template can handle at the moment!
    // so we're hardcoding in this instance TODO: Implement this with a full JSON file someday.
    const rosterHeaders = ["Player", "Salary", "PER"];

    for(let key in rosterHeaders) {
        let cell = row.insertCell(); //fun fact index -1 will insert at the bottom of the table.
        //an HTML element typically consists of an element and text node. So here we specify the element, and the text (how to bold the player table)
        let header = document.createElement("H3");
        let text = document.createTextNode(rosterHeaders[key]);
        header.appendChild(text);
        cell.appendChild(header);
    }
}

//TODO: When I'm ready to implement more data, I will need to set up my JSON file to contain only what I want to put on the roster.
//for now we're just going to hardcode a few attributes.
function generatePlayerTable(table, data){

    table.innerHTML = data.map(player =>
    `
    <tr>
        <td><img src="${player.Picture}" height="50px" width="40px" <br> ${player.Name} <br> ${player.Position} </td>
        <td>${formatter.format(player.Salary)} </td>
        <td>${player.PER}</td>
    </tr>    
    `).join("")

}



  //event listener for second page
$(document).ready(function(){
    $('.test').click(function(e){
      e.preventDefault();
      //gets the selected teams from the index.html page.
      var test = JSON.parse(localStorage.getItem('selectedTeams'));
      //get path to our JSON database
      $.getJSON("./players.json", function(teams){
      var x = teams.filter(team => team.Team.match(test[0]));
      console.log(x);
    });
    });
  });

function generateRosterHeader(teamName){
    const rosterHeader = document.querySelector(".trade-block-container");
    console.log(teamName)
     $.getJSON("./logos.json", function (teams) {
         const teamRoster= teams.filter(team =>  team.Team.match(teamName));
         rosterHeader.innerHTML += `
          ${teamRoster[0].Team}            
          <img class="team__logo" src="${teamRoster[0].Logo}" height="50px" width="55px" alt="${teamRoster[0].Team}"/>
    `
    });
}
      //gets the selected teams from the index.html page.
const teamDatabase = JSON.parse(localStorage.getItem('selectedTeams'));
const teamsToCreate = teamDatabase.length ; //account for 0 index
console.log(teamsToCreate);

 //set the tables that may get used
const firstTeam = document.querySelector('.playerTable1');
const secondTeam = document.querySelector('.playerTable2');
const thirdTeam = document.querySelector('.playerTable3');
const forthTeam = document.querySelector('.playerTable4');
//keep array, will match the index of the length of team rosters we need to make.
let teamTables = [firstTeam, secondTeam, thirdTeam, forthTeam];


/**
 *
 *  2) After we clean the format,we should create some new assets of our team logos. Let's name them the same as the team names so we can call them easier. Bonus
 *  points if you can clean up the logos but honestly maybe don't I want to finish this project asap. We can clean up later always.
 *  2a) We'll havce to spend some time designing how we're going to insert the team's logo/name on top of the table. If we do this job well it'll make part 3 not as hard.
 *  3) We might take a little trip back to the webscrapers and go get the salary cap for all the teams.
 *  4) Then similiar to step 2, put the salary cap over the roster, but below the team/logo
 *
 *  Let's get there before talking more.
 *
 */
for(let i = 0; i < teamsToCreate; i++) {
    generateRosterHeader(teamDatabase[i]);
     //get path to our JSON database. I wanted to not use jQuery but it was just really easy here.
    $.getJSON("./players.json", function (teams) {
        const players = teams.filter(team => team.Team.match(teamDatabase[i]));
        generatePlayerTable(teamTables[i], players);
        generatePlayerTableHead(teamTables[i], players);
    });
}

let playerSelected = document.querySelectorAll("[class^='playerTable']");
console.log(playerSelected)
for(const tr of playerSelected){
    tr.addEventListener('click', function(e){
        if(e.path[1].classList.contains('tradeSelected')){
            e.path[1].classList.remove('tradeSelected')
        }
        else{
            e.path[1].classList.add('tradeSelected')
        }

    console.log(e.path[1].querySelectorAll('td')[1].innerHTML)
    })
}

