const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());
mongoose.connect(
"mongodb+srv://quested:quested123@cluster0.p8jwq54.mongodb.net/quested",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
.then(() => {
    console.log("MongoDB connected");
})
.catch(err => {
    console.log("MongoDB error:", err);
});
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    progress: Object
});

const User = mongoose.model("User", userSchema);

/* SIGNUP */
app.post("/signup", async (req,res)=>{

    const {email,password} = req.body;

    console.log("Signup request:", email, password);

    const exists = await User.findOne({email});

    if(exists){
        console.log("User already exists");
        return res.json({success:false});
    }

    const user = new User({
        email,
        password,
        progress:{}
    });

    await user.save();

    console.log("User saved to DB:", email);

    res.json({success:true});
});

/* LOGIN */
app.post("/login", async (req,res)=>{

    const {email,password} = req.body;

    const user = await User.findOne({
        email,
        password
    });

    if(!user){
        return res.json({success:false});
    }

    res.json({success:true});
});


/* SAVE PROGRESS */
app.post("/progress", async (req,res)=>{

    const {email,quest} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.json({success:false});
    }

    user.progress[quest] = true;

    await user.save();

    res.json({success:true});
});
/* GET PROGRESS */
app.get("/progress/:email", async (req,res)=>{

    const email = req.params.email;

    const user = await User.findOne({email});

    if(!user){
        return res.json({success:false});
    }

    res.json({
        success:true,
        progress:user.progress
    });

});


app.get("/", (req, res) => {
    res.send("Backend running");
});


app.listen(PORT, () => {
    console.log("Server running");
});