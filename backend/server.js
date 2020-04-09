const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.js");
const levelRoute = require("./routes/level.js");
const blockRoute = require("./routes/block.js");

const HOST = '0.0.0.0';
const PORT = 9090;

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
app.use("/api", userRoute);
app.use("/api", levelRoute);
app.use("/api", blockRoute);

app.get('/api', (_, res) => {
    res.send({
        users_url: `${HOST}:${PORT}/api/users`,
        levels_url: `${HOST}:${PORT}/api/levels`,
        blocks_url: `${HOST}:${PORT}/api/blocks`,
        user_url: `${HOST}:${PORT}/api/users/{login}`,
        user_levels_url: `${HOST}:${PORT}/api/levels/{creator}`
    });
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);