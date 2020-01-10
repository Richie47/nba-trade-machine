/**
 *GLOBAL VARIABLES BELOW
 */
const salCap2019 = 132627000;
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

//GLOBAL MAP (KEY = ROSTER TABLE) -> (VALUE = TEAM NAME)
let rosterTeamMap = mapTeamRosterPair(teamDatabase,teamsToCreate,teamTables);

const modal = document.querySelector(".trade-modal");
const closeButton = document.querySelector(".close-button");
try {
closeButton.addEventListener("click", toggleModal);
}
catch(error){
    console.error(error)
}

let executeTrade = document.querySelector(".trade");
executeTrade.addEventListener("click", tryTrade);

/**
 *  master method of what happens when you click "Trade" button
 */
function tryTrade(){
    let curSalDif = 0;
    //call incoming-salary gatherer -> they call formatter, then decide how to add to a dictonary or something to access it, or just return an array
    const teamSalaries = [];
    const incSal = [];
    const outSal = [];
    //call outgoing-salary gatherer same thing

    //need to create some form of trade logic, may have to break it up.
    for(let i = 0; i < teamsToCreate; i++){
        curSalDif = 0;
        console.log(gatherTradeIncomeSalary(i));
        console.log(gatherTradeOutgoingSalary(i));
        console.log(gatherSalaryCap(i));
        let curIncSal = Number(gatherTradeIncomeSalary(i));
        let curOutSal = Number(gatherTradeOutgoingSalary(i));
        let curSalCap = Number(gatherSalaryCap(i));
        curSalDif = curIncSal - curOutSal;
        curSalCap = curSalCap + curSalDif;
        //hacky code if no salary is being moved we set it to 0 so it doesn't interfere with the trade logic
        if(curSalDif === 0){
            teamSalaries.push(0);
        }
        else {
            teamSalaries.push(curSalCap);
            incSal.push(curIncSal);
            outSal.push(curOutSal);
        }
    }

    for(let i = 0; i < teamSalaries.length; i++){
        console.log("yo one" + teamSalaries[i]);
        if(teamSalaries[i] == 0){
            continue;
        }

        else{
            if(isOverCap(teamSalaries[i]) === true){
               //if the outgoing salary is within 0-6.5M
               if(outSal[i] < 6533333){
                   if(incSal[i] > outSal[i] * 1.75 + 100000){
                       alert("over the cap")
                   }
               }

               else if(outSal[i] > 6533334 && outSal[i] < 19600000){
                   if(incSal[i] > outSal[i] + 5000000){
                       alert("over the cap 2");
                   }
               }

               else if(outSal[i] > 19600000 ){
                   if(incSal[i] > outSal[i] * 1.25 + 100000){
                       alert("over the cap 3");
                   }
               }
            }
        }
    }


}

function isOverCap(curSalary){
    if(curSalary > salCap2019){
        return true;
    }
    return false;
}

function gatherSalaryCap(curTeam){
    let curSalCap = document.querySelectorAll(".salary-cap")[curTeam].innerHTML;
    curSalCap = stripCurrency(curSalCap);
    return curSalCap;
}

function gatherTradeIncomeSalary(curTeam){
    console.log(curTeam)
    let curIncSal = document.querySelectorAll(".income-salary")[curTeam].innerHTML;
    curIncSal = stripCurrency(curIncSal);
    return curIncSal;
}

function gatherTradeOutgoingSalary(curTeam){
    console.log(curTeam)
    let curOutSal = document.querySelectorAll(".outgoing-salary")[curTeam].innerHTML;
    curOutSal = stripCurrency(curOutSal);
    return curOutSal;
}
/*  END OF GLOBAL VARIABLES */

/* GLOBAL PROCESSES BELOW */

//create a key-value pairing of roster tables and team assigned
//@param the array of selected teams from index.html, the length of the selected teams array
//@method we assign each key to be one of the roster table names, associate the value with the team name it's currently hosting, and an int that
// will keep track of incoming salary from trades
//@return the map containing a roster-team key-value pair for global use
function mapTeamRosterPair(teamDatabase, teamsToCreate) {
    let rosterTeamMap = new Map();

    for(let i = 0; i < teamsToCreate; i++){
        rosterTeamMap.set(`playerTable${i+1}`, {teamName:teamDatabase[i], tradeBlock:[], outTradeSalary: 0, inTradeSalary: 0 });
    }

    return rosterTeamMap;
}

/**
 * @param currentTeam - String of the roster table the trade target came from
 * @method - iterate through the map rosterTeamMap and add all non matching team name value pairs to an array
 * @return Array a string array that contains all the possible teams the target can be traded too.
 */
function findAvailableTeams(currentTeam){
    let availableTeams = [];
    //for every key value pair in the rosterTeamMap
    for(const [key,value] of rosterTeamMap){
       if(key == currentTeam){/**continue to next key if any remain. Not trading the player to the same team.*/}
       //otherwise we add the key's value->teamName into the array
       else{
          availableTeams.push(value.teamName);
       }
    }
    return availableTeams;
}


function addToTradeBlock(team, player,playerSelector, playerSalary, rosterTable){
  for(const [key,value] of rosterTeamMap){
      console.log(key)

      let tradeBlockSelector = key.substring(key.length-1,key.length);
      if(key == rosterTable){
         let outgoingSalarySelector = document.querySelectorAll(".outgoing-salary");
         value.outTradeSalary = value.outTradeSalary + parseInt(playerSalary);
         outgoingSalarySelector[tradeBlockSelector-1].innerHTML = formatter.format(value.outTradeSalary);
      }
      if(value.teamName == team){
          value.tradeBlock.push(player);
          document.querySelectorAll(".incoming-trade")[tradeBlockSelector-1].innerHTML =  value.tradeBlock.join("");
          playerSelector.classList.add("tradeSelected");
          toggleModal(); //modal interface for what team to trade the player too
          value.inTradeSalary = value.inTradeSalary + parseInt(playerSalary);
          let incomingSalarySelector = document.querySelectorAll(".income-salary");
          incomingSalarySelector[tradeBlockSelector-1].innerHTML = formatter.format(value.inTradeSalary);
        }

      }
  }

  function removeFromTradeBlock(team, player, playerSelector, playerSalary){

    for(const [key,value] of rosterTeamMap){
            let tradeBlockSelector = key.substring(key.length-1, key.length);
            console.log( key + " " + value.inTradeSalary)

            if(key == team){
                let outgoingSalarySelector = document.querySelectorAll(".outgoing-salary");
                value.outTradeSalary = value.outTradeSalary - parseInt(playerSalary);
                outgoingSalarySelector[tradeBlockSelector-1].innerHTML = formatter.format(value.outTradeSalary);
            }
            //if the tradeblock contains the player we want to remove, we know thats the roster we want to modify
            if(value.tradeBlock.includes(player)) {
                let incomingSalarySelector = document.querySelectorAll(".income-salary");

                value.inTradeSalary = parseInt(value.inTradeSalary) - parseInt(playerSalary);
                incomingSalarySelector[tradeBlockSelector - 1].innerHTML = formatter.format(value.inTradeSalary);
                value.tradeBlock = value.tradeBlock.filter((currentPlayer) => currentPlayer != player);
                document.querySelectorAll(".incoming-trade")[tradeBlockSelector - 1].innerHTML = value.tradeBlock.join("");
                playerSelector.classList.remove('tradeSelected');
            }

        }
    }


/**
 * @param availableTeams - string array containing all potential teams a target can be traded too
 * @method - iterate through availableTeams and grab each team's corresponding logo from logos.json
 * Then we will append the logo onto the trade-modal screen to give users a selection of where to put the traded player.
 */
function showAvailableTeams(availableTeams, player, playerSelector, playerSalary, rosterTable) {
    let tradeModalContent = document.querySelector(".target-teams");
    tradeModalContent.innerHTML = "";

    $.getJSON("./logos.json", teams => {
        for (const newTeam in availableTeams) {
            const teamRoster = teams.filter(team => team.Team.match(availableTeams[newTeam]));
            tradeModalContent.innerHTML += `
          <img class="test2-class" data-team="${availableTeams[newTeam]}" id="team-trade-logo"
           src="${teamRoster[0].Logo}" height="50px" width="55px"/>
    `

            let test = document.querySelectorAll(".test2-class");
            for (let elem of test) {
                elem.addEventListener("click", (evt => {
                    addToTradeBlock(evt.target.dataset.team, player,playerSelector, playerSalary, rosterTable)
                }))

            }
        }
    });
}

//ROSTER TEMPLATE MAKER, go through each team and get the appropriate player data to fill out the table for each team
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
        let rosterTableFinder = e.path[4].innerHTML.toString(); //return a portion of the target's html
        const rosterTable = rosterTableFinder.match(/playerTable.?/g); //search for the part of html that says the playerTable the target's on
        let playerSalary = e.path[1].querySelectorAll('td')[1].innerHTML;

        let currentIndex = rosterTable.toString().substring(rosterTable.toString().length-1, rosterTable.toString().length);
        console.log("curr: " +  currentIndex);
        //j.log(res.toString())
        playerSalary = playerSalary.replace(/\D/g, '');// regex for removing currency format on salary
        if(e.path[1].classList.contains('tradeSelected')){
            console.log(rosterTable)
            removeFromTradeBlock(rosterTable, clickedPlayer, e.path[1], playerSalary)
           // e.path[1].classList.remove('tradeSelected')
            //tradeBlock = tradeBlock.filter((player) => player != clickedPlayer);
           // document.querySelector(".confirm-trade").innerHTML = tradeBlock.join("");
        }
        else{
            //outcomeSal = parseInt(outcomeSal) +  parseInt(playerSalary);
            const availableTeams = findAvailableTeams(rosterTable);
            showAvailableTeams(availableTeams, clickedPlayer, e.path[1], playerSalary, rosterTable);
            //outgoingSalarySelector[currentIndex-1].innerHTML = formatter.format(outcomeSal);
//            e.path[1].classList.add('tradeSelected');
//            tradeBlock.push(clickedPlayer);
            //document.querySelector(".confirm-trade").innerHTML = tradeBlock.join("");
            toggleModal();
            console.log('yo')
        }

        //demo = demo.substring(0,50)
        /**
        let test=  document.querySelector(".income-salary");
        x = formatter.format(x)
        test.innerHTML = x;
        **/
    })
}

/*END GLOBAL PROCESSES*/

function toggleModal(){
    modal.classList.toggle("show-modal")
}

/**@param string or integer that needs to be converted to US currency
* Usage: you can call like : formatter.format(<arg>)
 * Note: If you feed a number or string that already contains currency format like $ or , it will return "$NaN"
 */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

/**
 * @param currency, the value to remove the the currency formatting off using regex to strip anything that's not
 * a number or period
 * @returns a string that has the currency stripped, ex: $123,456 -> 123456
 */
function stripCurrency(currency){
    return currency.replace(/[^0-9\.]+/g,"");
}

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
    for(const i in data){
        if(data[i].Position == null){
            data[i].Position = "-";
        }
        if(data[i].Salary == null){
            data[i].Salary = "838464";
        }

        if(data[i].PER == ""){
            data[i].PER = "0.0";
        }

        if(data[i].Age == null){
            data[i].Age = "-";
        }
    }
    table.innerHTML += data.map(player =>

    `
    <tr>
        <td><img src="${player.Picture}" height="50px" width="40px" <br> ${player.Name} <br>  Age: ${player.Age}<br> Position: ${player.Position} <br> </td>
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
         <b> ${teamRoster[0].Team}</b>           
          <img class="team__logo" src="${teamRoster[0].Logo}" height="50px" width="55px" alt="${teamRoster[0].Team}"/>
           <br><b>INCOMING SALARY: </b><div class="income-salary">$0 </div>
            <b>OUTGOING SALARY:</b><div class="outgoing-salary">$0</div>
    `
    });
    $.getJSON("./salary_cap.json", function (teams) {
        const teamSalary = teams.teamSalaries.filter(team => team.Team.match(teamName));
        rosterHeader.innerHTML += ` <br>
        <b>Salary Cap: </b><div class="salary-cap">${teamSalary[0].Salary_Cap} </div> <b>Cap Space Available: </b> <div class="cap-space">${teamSalary[0]["Cap Space"]}</div>`
    });
}

/**TODO: Honestly don't know if this code is needed anymore, decide if we should keep it.
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
