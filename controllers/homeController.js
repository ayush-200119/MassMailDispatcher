const express=require("express");
const router=express.Router();
const uploadAndViewController=require(__dirname+"/uploadAndViewController.js");
// const viewController=require(__dirname+"/viewController.js");
router.get("/",function(req,res){
    res.render("home",{isLoggedIn:false,userid:''});
});

router.get("/:userid",function(req,res){
    const id=req.params.userid;
    res.render("home",{isLoggedIn:true,userid:id});
});

router.get("/:userid/logout",function(req,res){
    res.redirect("/");
});

router.get("/:userid/mail",function(req,res){
    const id=req.params.userid;
    res.render("mail",{userid:id});
});

router.post("/:userid/mail",function(req,res){
    console.log(req.body);

    //get the content and the subject of the mail here
    //get the rectified emails here
    //mail everyone in the array using smtpjs

    res.send("Request Received");
});

router.use("/",uploadAndViewController);

module.exports=router;