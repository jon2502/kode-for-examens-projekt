var express = require('express');
var router = express.Router();
const path = require("path");
const multer  = require('multer');
//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      imageName = Date.now() + Math.floor(Math.random()* 100000) + path.extname(file.originalname);
      cb(null, imageName);
    },
  });
const upload = multer({storage:storage})

//controllers
files = require('../controllers/filesController.js')
forslags = require('../controllers/forslagController.js')
likesdislikes = require('../models/likesdislikes.js');
//models
Forslagmodle = require("../models/forslag.js");

//middleware
mails = require("../middleware/mailsender.js")


router.get('/list/:state', async function(req, res) {
    if(req.params.state == 0){
        var title="pending"
    } else if(req.params.state == 1){
        var title="rejected"
    } else if(req.params.state == 2){
        var title="accepted"
    }
    const findForslags = await Forslagmodle.find({
      state: req.params.state
    }).sort({Dateadded: 1 });
      if(findForslags.length <= 0){
        res.render('forslag/list',{title:title})
      }else{
        const color_option = req.session.color
        const likesdislikes_option = req.session.likesdislikes
        if(req.flash('errortoken')){
          infoMessage = (req.flash('error')[0])
          res.render('forslag/list',{
            currentstate:req.params.state,
            display:findForslags,
            info:infoMessage,
            title:title,
            color_option:color_option,
            likesdislikes_option:likesdislikes_option
          })
        }else{
          res.render('forslag/list',{
            currentstate:req.params.state,
            display:findForslags,
            title:title,
            color_option:color_option,
            likesdislikes_option:likesdislikes_option
          })
        }
      }
});

router.get('/list/:state/:filter/:filtersetting', async function(req, res) {
  if(req.params.state == 0){
      var title="pending"
  } else if(req.params.state == 1){
      var title="rejected"
  } else if(req.params.state == 2){
      var title="accepted"
  }
  
  var sort = {}
  var objname = req.params.filter
  var objvalue = req.params.filtersetting
  sort[objname] = objvalue

  const findForslags = await Forslagmodle.find({
    state: req.params.state
  }).sort(sort);
    if(findForslags.length <= 0){
      res.render('forslag/list',{title:title})
    }else{
      const color_option = req.session.color
      const likesdislikes_option = req.session.likesdislikes
      if(req.flash('errortoken')){
        infoMessage = (req.flash('error')[0])
        res.render('forslag/list',{
          currentstate:req.params.state,
          display:findForslags,
          info:infoMessage,
          title:title,
          color_option:color_option,
          likesdislikes_option:likesdislikes_option
        })
      }else{
        res.render('forslag/list',{
          currentstate:req.params.state,
          display:findForslags,
          title:title,
          color_option:color_option,
          likesdislikes_option:likesdislikes_option
        })
      }
    }
});

router.get('/form', function(req, res) {
    res.render('forslag/form')
});

router.post('/form', upload.array('files'),forslags.newForslag, mails, function(req, res) {
  res.redirect('/forslag/list/0')
});


module.exports = router;
