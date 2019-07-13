const fs = require('fs')

fs.readFile('logo', (err,data) => {
    if (err) throw err;

    console.log(data.toString().split(" "))
    for(word of data){
    }
    const ["team" "logo"] = data.toString().split(" ");
})

