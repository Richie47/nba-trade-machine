var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var reload = require('reload'); //npm install -g --save-dev reload
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname,'./images')));
app.use(express.static(path.join(__dirname, './logos')));
app.use(express.static(path.join(__dirname, './salary_cap')));


var server = http.createServer(app);
//reload code to refresh browser upon code completion
reload(app).then(function (reloadReturned) {
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    //for heroku
    //const port = process.env.PORT || 3000

    console.log("Example app listening at http://%s:%s", host, port);

    if (process.send){
        process.send('online');
    }
});
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
});
