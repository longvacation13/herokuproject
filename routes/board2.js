var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');
 
router.get('/',function(req, res, next) {    
    res.redirect('boardList');    
});

var firebaseConfig = {
    apiKey: "AIzaSyBaXrHeC86QHMwx3PUNf571LuAZynIRs4c",
    authDomain: "heroku-pro.firebaseapp.com",
    projectId: "heroku-pro",
    storageBucket: "heroku-pro.appspot.com",
    messagingSenderId: "217820123242",
    appId: "1:217820123242:web:35f10eff6bf3a5a3a5fa13",
    measurementId: "G-DY0534E4MV"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(); 
        
router.get('/boardList',function(req, res, next) {        
    db.collection('board').orderBy("brddate","desc").get()
         .then((snapshot) => {
             var rows = [];
             snapshot.forEach((doc) => {
                 var childData = doc.data();
                 childData.brddate = dateFormat(childData.brddate,"yyyy-mm-dd");
                 rows.push(childData);
             });
             res.render('board2/boardList', {rows: rows});
         })
         .catch((err) => {
             console.log('Error getting documents', err);
         });
});
 
router.get('/boardRead',function(req, res, next) {
    db.collection('board').doc(req.query.brdno).get()
        .then((doc) => {
            var childData = doc.data();
             
            childData.brddate = dateFormat(childData.brddate,"yyyy-mm-dd hh:mm");
            res.render('board2/boardRead', {row: childData});
        })
});
 
router.get('/boardForm',function(req,res,next){
    if (!req.query.brdno) {// new
        res.render('board2/boardForm', {row:""});
        return;
    }
     
    // update
    db.collection('board').doc(req.query.brdno).get()
          .then((doc) => {
              var childData = doc.data();
              res.render('board2/boardForm', {row: childData});
          })
});
 
router.post('/boardSave',function(req,res,next){
    var postData = req.body;
    if (!postData.brdno) { // new
        postData.brddate = Date.now();
        var doc = db.collection("board").doc();
        postData.brdno = doc.id;
        doc.set(postData);
    }else {               // update
        var doc = db.collection("board").doc(postData.brdno);
        doc.update(postData);
    }
     
    res.redirect('boardList');
});
 
router.get('/boardDelete',function(req,res,next){
    db.collection('board').doc(req.query.brdno).delete()
 
    res.redirect('boardList');
});


module.exports = router;