const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.js");
const levelRoute = require("./routes/level.js");

const HOST = '0.0.0.0';
const PORT = 9090;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use("/api", userRoute);
app.use("/api", levelRoute);

app.get('/api', (req, res) => {
    res.send({
        users_url: `${HOST}:${PORT}/api/users`,
        levels_url: `${HOST}:${PORT}/api/levels`,
        user_url: `${HOST}:${PORT}/api/users/{user}`,
        user_levels_url: `${HOST}:${PORT}/api/levels/{user}`
    });
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);