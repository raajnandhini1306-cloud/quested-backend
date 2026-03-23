const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

/* ---------- Helper Functions ---------- */

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

    const userExists = data.users.find(user => user.email === email);

    if (userExists) {
        return res.json({ success: false, message: "User already exists" });
    }

    const newUser = {
        email,
        password,
        progress: {}
    };

    data.users.push(newUser);
    writeData(data);

    res.json({ success: true, message: "Signup successful" });
});

/* ---------- LOGIN ---------- */

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const data = readData();

    const user = data.users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({
        success: true,
        message: "Login successful",
        userEmail: email
    });
});

/* ---------- SAVE PROGRESS ---------- */

app.post("/progress", (req, res) => {
    const { email, quest } = req.body;

    const data = readData();

    const user = data.users.find(user => user.email === email);

    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    user.progress[quest] = true;

    writeData(data);

    res.json({ success: true, message: "Progress saved" });
});

/* ---------- GET PROGRESS ---------- */

app.get("/progress/:email", (req, res) => {
    const email = req.params.email;

    const data = readData();

    const user = data.users.find(user => user.email === email);

    if (!user) {
        return res.json({ success: false });
    }

    res.json({
        success: true,
        progress: user.progress
    });
});

/* ---------- START SERVER ---------- */
app.get("/", (req, res) => {
    res.send("QuestEd backend is running 🚀");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});