const express = require("express");

const app = express();
const port = 80;

app.get("/customer", (req, res) => {
    res.send("Hello");
});

app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});