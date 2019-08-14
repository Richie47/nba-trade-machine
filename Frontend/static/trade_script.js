/**
 *GLOBAL VARIABLES BELOW
 */
 //gets the selected teams from the index.html page.
const teamDatabase = JSON.parse(localStorage.getItem('selectedTeams'));
const teamsToCreate = teamDatabase.length ; //account for 0 index, integer of how many teams were selected from index.html

 //set the tables that may get used(depending on # of teams selected), these are what the "roster sheets" are made of
//some of these variables may not be used
const firstTeam = document.querySelector('.playerTable1');
const secondTeam = document.querySelector('.playerTable2');
const thirdTeam = document.querySelector('.playerTable3');
const forthTeam = document.querySelector('.playerTable4');
//keep array, will match the index of the length of team rosters we need to make.
const teamTables = [firstTeam, secondTeam, thirdTeam, forthTeam];
let playerSelected = document.querySelectorAll("[class^='playerTable']");
let tradeBlock = [];
let newTradeBlock = [];

const modal = document.querySelector(".trade-modal");
const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", toggleModal);

/*  END OF GLOBAL VARIABLES */

/* GLOBAL PROCESSES BELOW */
for(let i = 0; i < teamsToCreate; i++) {
    generateRosterHeader(teamDatabase[i], i );
     //get path to our JSON database. I wanted to not use jQuery but it was just really easy here.
    $.getJSON("./players.json", function (teams) {
        const players = teams.filter(team => team.Team.match(teamDatabase[i]));
        generatePlayerTable(teamTables[i], players);
        generatePlayerTableHead(teamTables[i], players, teamDatabase[i]);
    });
}

for(const tr of playerSelected){
    tr.addEventListener('click', function(e){
        const clickedPlayer = e.path[1].querySelectorAll('td')[0].innerHTML;
        tr.addEventListener("click", toggleModal)
        if(e.path[1].classList.contains('tradeSelected')){
            console.log('yoo')
            e.path[1].classList.remove('tradeSelected')
            newTradeBlock = tradeBlock.filter((player) => player != clickedPlayer);
            tradeBlock = newTradeBlock;
            //console.log(newTradeBlock)
             document.querySelector(".confirm-trade").innerHTML = newTradeBlock.join("");
        }
        else{
            console.log('in else')
            e.path[1].classList.add('tradeSelected');
            tradeBlock.push(clickedPlayer);
            //console.log(tradeBlock)
            document.querySelector(".confirm-trade").innerHTML = tradeBlock.join("");
        }
        console.log(e.path[4])
        let demo = e.path[4].innerHTML.toString()
        //demo = demo.substring(0,50)
        const res = demo.match(/playerTable.?/g);
        console.log(res.toString())
//        console.log(e.target.parentElement.parentElement.parentElement)
        //console.log(x.replace(/\D/g, ''))  regex for removing currency format on salary
    })
}

/*END GLOBAL PROCESSES*/

function toggleModal(){
    modal.classList.toggle("show-modal")
}

//used to take off the currency format of the player's salaries for the trade logic
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

    table.innerHTML += data.map(player =>
    `
    <tr>
        <td><img src="${player.Picture}" height="50px" width="40px" <br> ${player.Name} <br> ${player.Position} <br> </td>
        <td>${formatter.format(player.Salary)} </td>
        <td>${player.PER}</td>
    </tr>    
    `).join("")

}

function generateRosterHeader(teamName, index){
    const divs = document.getElementsByClassName("team-salary");
    let rosterHeader =  divs[index];

     $.getJSON("./logos.json", function (teams) {
         const teamRoster= teams.filter(team =>  team.Team.match(teamName));
         rosterHeader.innerHTML += `
          ${teamRoster[0].Team}            
          <img class="team__logo" src="${teamRoster[0].Logo}" height="50px" width="55px" alt="${teamRoster[0].Team}"/>
    `
    });
    $.getJSON("./salary_cap.json", function (teams) {
        const teamSalary = teams.teamSalaries.filter(team => team.Team.match(teamName));
        rosterHeader.innerHTML += ` <br>
        Salary Cap: ${teamSalary[0].Salary_Cap}  Cap Space Available: ${teamSalary[0]["Cap Space"]}`
    });
}

/**TODO: Honestly don't know wtf this code does, figure out if we need it still
  //event listener for second page
$(document).ready(function(){
    $('.test').click(function(e){
      e.preventDefault();
      //gets the selected teams from the index.html page.
      const chosenTeams= JSON.parse(localStorage.getItem('selectedTeams'));
      //get path to our JSON database
      $.getJSON("./players.json", function(teams){
      let numberOfFoundTeams = teams.filter(team => team.Team.match(chosenTeams[0]));
      console.log("yo" + numberOfFoundTeams);
    });
    });
  });
 **/
