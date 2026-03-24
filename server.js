const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");


function readData() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}


/* ---------- SIGNUP ---------- */

app.post("/signup", (req, res) => {

    const { email, password } = req.body;

    const data = readData();

    const userExists = data.users.find(
        user => user.email === email
    );

    if (userExists) {
        return res.json({
            success: false,
            message: "User exists"
        });
    }

    const newUser = {
        email,
        password,
        progress: {}
    };

    data.users.push(newUser);
    writeData(data);

    res.json({
        success: true
    });
});


/* ---------- LOGIN ---------- */

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const data = readData();

    const user = data.users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.json({
            success: false
        });
    }

    res.json({
        success: true
    });

});


/* ---------- TEST ---------- */

app.get("/", (req, res) => {
    res.send("Backend running");
});


app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
