const express = require("express");
const app = express();
const mongoose = require("mongoose");


//database connectivity
mongoose.connect('mongodb://localhost:27017/oneplus', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB Connected");
}).catch(err=>{
    console.log("Error : "+ err);
})

//middlewares
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}))

//mongoose configuration
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    dob: String,
    gender: String
})
const User = mongoose.model("User", userSchema);

//GET Routes
app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/login.html");
})
app.get("/home", (req, res)=>{
   res.sendFile(__dirname+"/main.html");
})

app.get("/signup", (req, res)=>{
    res.sendFile(__dirname+"/signup.html");

})

//POST Routes
app.post("/login", (req, res)=>{
    //flag=1;
    User.findOne({email: req.body.user, password: req.body.pass}).then((data)=>{
        if(data){
            //console.log(data)
            res.redirect("/home"); 
        }else{
            res.redirect("/signup");
        }
    }).catch(err=>{
        console.log(err)
        res.redirect("/");
    })
})
app.post("/signup", (req, res)=>{
    var data = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email:  req.body.email,
        password: req.body.password,
        dob: `${req.body.month}/${req.body.day}/${req.body.year}`,
        gender: req.body.gender
    }
    if(data.password === req.body.confirm_password){
        var user = new User(data);
        user.save();
        res.redirect("/")
    }else{
        res.redirect("/signup");
    }
})


//PORT Listening

app.listen(3000, ()=>{
    console.log("Server Started");
})