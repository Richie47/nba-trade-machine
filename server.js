let express = require('express');
const http = require('http');
let PORT = process.env.PORT || 5000;
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "./Frontend/static")));
app.use(express.static(path.join(__dirname,'./Frontend/static/images')));
app.use(express.static(path.join(__dirname, './Frontend/static/logos')));
app.use(express.static(path.join(__dirname, './Frontend/static/salary_cap')));

//reload code to refresh browser upon code completion
    const server = app.listen(PORT, function () {
        const host = server.address().address;
        const port = server.address().port;
        //for heroku
        //const port = process.env.PORT || 3000

        console.log("Example app listening at http://%s:%s", host, port);
    });
