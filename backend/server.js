const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.js");

const HOST = '0.0.0.0';
const PORT = 9090;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use("/api", userRoute);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);