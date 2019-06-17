 
 
 const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

  
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

//event listener for clicking player row
 $(document).ready(function(){
     $('#playerTable tr').click(function(){
         var booka = $(this).find("tr");
         alert('hi');

     })
 });
      //gets the selected teams from the index.html page.
     var test = JSON.parse(localStorage.getItem('selectedTeams'));
     let teamsToCreate = test.length ; //account for 0 index
     console.log(teamsToCreate);
     let table = document.getElementById("playerTable");
     const toClone = document.getElementsByTagName("playerTable")[0];
     let secondTeam = table.cloneNode(true);
     let thirdTeam = table.cloneNode(true);
     let forthTeam = table.cloneNode(true);

     let teamTables = [table, secondTeam, thirdTeam, forthTeam];

     for(let i = 0; i < teamsToCreate; i++) {
        document.body.appendChild(teamTables[i]);
         //get path to our JSON database
         $.getJSON("./players.json", function (teams) {
             let x = teams.filter(team => team.Team.match(test[i]));
            for (let j = 0; j < x.length; j++) {
                 const currentRow = teamTables[i].insertRow(j + 1); //always add one to account for the column heading of the table
                 const name = currentRow.insertCell(0); //insert name, gotta figure out how to put the picture as well.
                 const salary = currentRow.insertCell(1);
                 const per = currentRow.insertCell(2);
                 //need to separately obtain the picture of the player
                 const img = document.createElement('img');
                 img.src = x[j].Picture;
                 console.log(img.src);
                 //now fill in the values given from the json
                 name.innerHTML = `<img src= ` + img.src + ` height=50px width=40px> <td> <br>` + x[j].Name + "\n" + x[j].Position + `</td>`;
                 salary.innerHTML = formatter.format(x[j].Salary) + "/ <br>" + x[j].YearsLeft + " yrs";
                 per.innerHTML = x[j].PER
             }

             console.log(x[i]); // this is now a reduced json array containing all the players from the selected team
         });
     }

