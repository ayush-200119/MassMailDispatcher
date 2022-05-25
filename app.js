
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const uniqid=require("uniqid");
const bcrypt = require('bcrypt');
var formidable = require('formidable');
var fs = require('fs');
const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app=express();

app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const User = require(__dirname+"/models/userSchema.js"); 
//Get Routes
//Home Route

app.get("/",function(req,res){
    res.render("home",{isLoggedIn:false,userid:''});
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/:userid",function(req,res){
    const id=req.params.userid;
    res.render("home",{isLoggedIn:true,userid:id});
});

app.get("/:userid/upload",function(req,res){
    const id=req.params.userid;
    res.render("upload",{userid:id});
});

app.get("/:userid/view",function(req,res){
    res.send("Viewing Rectified Docs");
});

app.get("/:userid/mail",function(req,res){
    res.send("Mailing everyone");
});

app.get("/:userid/logout",function(req,res){
    res.redirect("/");
});

//Post Routes

app.post("/register",function(req,res){
    
    const mail=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;

    //checking if the emal already exists

    //using bcrypt
    if(confirmPassword===password)
    {    
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(!err)
                {
                    const currId=uniqid();
                    const currUser= new User({
                        id:currId,
                        email:mail,
                        password:hash
                    });
                    
                    // console.log(currUser);

                    currUser.save(function(err,result){
                        if(err)
                        console.log(err);
                        // else
                        // console.log(result);
                    });
                    res.redirect(`/${currId}`);
                }
                else
                {
                    console.log(err);
                }
            });
        });
    }
    else
    {
        // Sending an alert kind-of-thing for acknowledgement
        res.redirect("/register");
    }

    // res.send("Post received");
});

app.post("/login",function(req,res){
    const mail=req.body.email;
    const password=req.body.password;

    User.findOne({email:mail},function(err,foundUser){
        if(!err)
        {
            if(!foundUser)
            {    
                //can give a pop-up before redirecting
                res.redirect("/register");
            }
            else{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(!err)
                {
                    if(result===true)
                    {
                        res.redirect(`/${foundUser.id}`);
                    }
                    else
                    {
                        //check your password again
                        res.redirect("/login");
                    }
                }
                else
                {
                    console.log(err);
                }
            });
            }
        }
        else
        {
            console.log(err);
        }
    });

});

app.post("/:userid/upload",function(req,res){
    // const fileToUpload=req.body.csv.json();
    // console.log(req);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.emails.filepath;
      var newpath = 'C:/Users/HP/Desktop/MassMailDispatcher/' + files.emails.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
    // res.send("Post received");

});

//Testing
app.listen(3000,()=>{
    console.log("Server Listening On Post 3000");
});