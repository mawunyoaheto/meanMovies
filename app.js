const express = require('express');
require("dotenv").config();
const cors = require('cors');
const app = express();
require('./api/data/db');
const movies_routes = require("./api/routes/index"); 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ALLOW_LIST);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,DELETE,POST,PUT");
    next();
});

app.use('/api', movies_routes);

const server = app.listen(process.env.PORT, () => {
    const port = server.address().port;
    console.log(process.env.LISTEN_TO_PORT_MSG + ' ' + process.env.HOST + port);
});