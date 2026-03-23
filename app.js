const express = require("express");
const app = express();

const branch = process.env.BRANCH || "unknown";

app.get("/", (req, res) => {
    res.send(`Running from branch: ${branch}`);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});