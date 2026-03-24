const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

let users = [];


/* SIGNUP */
app.post("/signup", (req, res) => {

    const { email, password } = req.body;

    const exists = users.find(u => u.email === email);

    if (exists) {
        return res.json({ success: false, message: "User exists" });
    }

    users.push({
        email,
        password,
        progress: {}
    });

    res.json({ success: true });

});


/* LOGIN */
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.json({ success: false });
    }

    res.json({ success: true });

});


/* SAVE PROGRESS */
app.post("/progress", (req, res) => {

    const { email, quest } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.json({ success: false });
    }

    user.progress[quest] = true;

    res.json({ success: true });

});


/* GET PROGRESS */
app.get("/progress/:email", (req, res) => {

    const email = req.params.email;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.json({ success: false });
    }

    res.json({
        success: true,
        progress: user.progress
    });

});


app.get("/", (req, res) => {
    res.send("Backend running");
});


app.listen(PORT, () => {
    console.log("Server running");
});