const express=require("express");
const bcrypt = require('bcrypt');
const mongoose=require("mongoose");
const User = require(__dirname+"/../models/userSchema.js"); 
const router=express.Router();

router.get("/",function(req,res){
    res.render("login");
});

router.post("/",function(req,res){
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

module.exports=router;