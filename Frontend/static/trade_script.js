
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
 * so it's been a while. We got the roster pic + salary cap like a week ago.
 *
 * The last of our UI which does tie into trade logic. We need to be able to click a player and well two
 * 1) have the player, picture, and salary neatly put above a different team
 * 2) create some form of interface that allows you to choose which team for multi team cases.
 * bonus if you only make itnerface work for 3+ teams only. We'll leave out the trade logic for this moment, but keep in mind we probably
 * want a counter of the salary traded.
 *
 * I was thinking of adding when clicked to a special selector.
 * First of all, we need to figure out how to figure out what table the player selected came from.
 * Then we need to think of how we're going to get him on top of another team. For now let's just worry about 2 team case.
 *
 *
 *
 */
for(let i = 0; i < teamsToCreate; i++) {
    generateRosterHeader(teamDatabase[i], i );
     //get path to our JSON database. I wanted to not use jQuery but it was just really easy here.
    $.getJSON("./players.json", function (teams) {
        const players = teams.filter(team => team.Team.match(teamDatabase[i]));
        generatePlayerTable(teamTables[i], players);
        generatePlayerTableHead(teamTables[i], players, teamDatabase[i]);
    });
}

let playerSelected = document.querySelectorAll("[class^='playerTable']");
let tradeBlock = [];
let newTradeBlock = [];

for(const tr of playerSelected){
    tr.addEventListener('click', function(e){
        const clickedPlayer = e.path[1].querySelectorAll('td')[0].innerHTML;
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

