const express=require("express");
const router=express.Router();
const uploadAndViewController=require(__dirname+"/uploadAndViewController.js");
const nodemailer = require("nodemailer");
const bodyParser=require("body-parser");
var fs = require('fs');
var formidable = require('formidable');

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
    const sub=req.body.subject;
    const content=req.body.content;

    // console.log(sub);
    // console.log(content);

    var form = new formidable.IncomingForm();
    let attachmentInfo=[];
        form.parse(req, function (err, fields, files) {
        console.log(files);
        var oldpath = files.attachments.filepath;
        var newpath = __dirname+"/../uploads/"+files.attachments.originalFilename;
        fs.rename(oldpath, newpath, function (err) {
            console.log("File Moved Successfully");
        });

        attachmentInfo.push(
            {
                path:newpath,
                filename:files.attachments.originalFilename
            });
            console.log(attachmentInfo);

        let transporter = nodemailer.createTransport({
            pool:true,
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.USER_NAME,
              pass: process.env.USER_PASSWORD,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
    
            }
          });
    
          let mailOptions={
              from:"testmaildispatcher@gmail.com",
              to:["testmaildispatcher@gmail.com","ayushsalvi19@gmail.com"],
              subject:sub,
              text:content,
              attachments:attachmentInfo
          };

            transporter.sendMail(mailOptions,function(err,data){
          if(!err)
          {
              console.log("Message Sent Successfully");
          }
          else
          {
              console.log(err);
          }
      });
    
    });


    let transporter = nodemailer.createTransport({
        pool:true,
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.USER_NAME,
          pass: process.env.USER_PASSWORD,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,

        }
      });

      let mailOptions={
          from:"testmaildispatcher@gmail.com",
          to:["testmaildispatcher@gmail.com","ayushsalvi19@gmail.com"],
          subject:sub,
          text:content,
          attachments:attachmentInfo
      };

      transporter.sendMail(mailOptions,function(err,data){
          if(!err)
          {
              console.log("Message Sent Successfully");
          }
          else
          {
              console.log(err);
          }
      });
      
    //get the content and the subject of the mail here
    //get the rectified emails here
    //mail everyone in the array using smtpjs

    res.send("Request Received");
});

router.use("/",uploadAndViewController);

module.exports=router;