 
 
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
      //gets the selected teams from the index.html page.
     var test = JSON.parse(localStorage.getItem('selectedTeams'));
      //get path to our JSON database 
      $.getJSON("./players.json", function(teams){
      var x = teams.filter(team => team.Team.match(test[0]));
      var table = document.getElementById("playerTable");

      for(var i = 0; i < x.length; i++){
        var currentRow= table.insertRow(i +1); //always add one to account for the column heading of the table
        var name = currentRow.insertCell(0); //insert name, gotta figure out how to put the picture as well.
        var salary = currentRow.insertCell(1);
        var per = currentRow.insertCell(2);
        //need to separately obtain the picture of the player
        var img = document.createElement('img');
        img.src = x[i].Picture;
        //now fill in the values given from the json
        name.innerHTML = `<img src="">`;
        salary.innerHTML = formatter.format(x[i].Salary);
        per.innerHTML = x[i].PER
      }

      console.log(x[0]); // this is now a reduced json array containing all the players from the selected team
      });

