var express = require('express');
var router = express.Router();
const path = require("path");
const multer  = require('multer');

//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      imageName = Date.now() + path.extname(file.originalname);
      cb(null, imageName);
    },
  });
const upload = multer({storage:storage})


//controllers
con = require('../controllers/infoController.js')

//models
Forslags = require('../models/forslag.js');
likesdislikes = require('../models/likesdislikes.js');
Files = require("../models/files.js")
Log = require("../models/logs.js")
Comments = require("../models/comments.js")

//midleware
mails = require("../middleware/mailsender.js")

//router for main list page
router.get('/:forslagid', async function(req, res) {
    forslagid = req.params.forslagid
    //check om url id er en valid mongodb ObjectId()
    //regex fra (JohnnyHK 2013) 
    if(forslagid.match(/^[0-9a-fA-F]{24}$/)){
      const findForslag = await Forslags.findOne({
        _id: forslagid
      });

      if(findForslag){
        let findimg = await Files.find({
          forslagid: req.params.forslagid,
          extension: {$in:['png','jpg','gif']}
        });
        if(!findimg.length){
          findimg = null
        }

        let findvideo = await Files.find({
          forslagid: req.params.forslagid,
          extension: 'mp4'
        });
        if(!findvideo.length){
          findvideo = null
        }

        let findaudio = await Files.find({
          forslagid: req.params.forslagid,
          extension: 'mp3'
        });
        if(!findaudio.length){
          findaudio = null
        }

        let findlogs = await Log.find({
          forslagid: req.params.forslagid
        });
        if(!findlogs.length){
          findlogs = null
        }

        let findcomments = await Comments.find({
          forslagid: req.params.forslagid
        });
        if(!findcomments.length){
          findcomments = null
        }

        let findlikes = await likesdislikes.find({
          forslagid: req.params.forslagid,
          value: "like"
        });

        let finddislikes = await likesdislikes.find({
          forslagid: req.params.forslagid,
          value: "dislike"
        });

        let checkuserlikes = await likesdislikes.findOne({
          forslagid: req.params.forslagid,
          username: req.session.user
        })
        
        const user = req.session.user
        const clerance = req.session.clerance
        const email = req.session.email
        const color_option = req.session.color
        const likesdislikes_option = req.session.likesdislikes

        if(req.flash('errortoken')){
          errorMessage = (req.flash('error')[0])
          res.render('info/info',{
            forslag:findForslag,
            images:findimg,
            videos:findvideo,
            sounds:findaudio,
            logs:findlogs,
            comments:findcomments,
            likes:findlikes.length,
            dislikes:finddislikes.length,
            uservalue:checkuserlikes,
            user:user,
            email:email,
            clerance:clerance,
            color_option:color_option,
            likesdislikes_option:likesdislikes_option,
            error:errorMessage
          })
        }else{
          res.render('info/info',{
            forslag:findForslag,
            images:findimg,
            videos:findvideo,
            sounds:findaudio,
            logs:findlogs,
            comments:findcomments,
            likes:findlikes.length,
            dislikes:finddislikes.length,
            uservalue:checkuserlikes,
            user:user,
            email:email,
            clerance:clerance,
            color_option:color_option,
            likesdislikes_option:likesdislikes_option
          })
        }
      }else{
        res.render('info/info')
      }
    } else{
      res.render('info/info')
    }
});

router.get('/editcomment/:id/:forslagid', async function(req, res) {
  const findcomment = await Comments.findOne({
    _id:req.params.id,
    forslagid:req.params.forslagid,
    username:req.session.user
  })
  if(findcomment){
    res.render('info/edit',{content:findcomment})
  }else{
    res.redirect('back')
  }
    
});

router.post('/editcomment',con.updatecoment, async function(req, res) {
  res.redirect('/info/'+req.body.forslagid)
}),

router.post('/deletecomment/:id/',con.deletecoment, function(req, res) {
  res.redirect('back')
});

router.post('/addcoment',con.addcoment, function(req, res) {
  res.redirect('/info/'+forslagid)
});

router.get('/updatestate/:state/:forslagid',con.changestate, mails, function(req, res) {
  res.redirect('/info/'+req.params.forslagid)
});

router.get('/like/:forslagid',con.like, function(req, res) {
  res.redirect('/info/'+req.params.forslagid)
});

router.get('/dislike/:forslagid',con.dislike, function(req, res) {
  res.redirect('/info/'+req.params.forslagid)
});

router.get('/remove/:forslagid',con.remove, function(req, res) {
  res.redirect('/info/'+req.params.forslagid)
});

router.post('/addfiles', upload.array('files'), con.upload_from_info, function(req, res) {
  res.redirect('back')
});

router.get('/fileeditor/:forslagid', async function(req, res) {
  //regex fra (JohnnyHK 2013) 
  if(forslagid.match(/^[0-9a-fA-F]{24}$/)){
    const findForslag = await Forslags.findOne({
      _id: forslagid
    });
      if(findForslag){
        if(findForslag.name == req.session.user){
          let findimg = await Files.find({
            forslagid: req.params.forslagid,
            extension: {$in:['png','jpg','gif']}
          });
          if(!findimg.length){
            findimg = null
          }
    
          let findvideo = await Files.find({
            forslagid: req.params.forslagid,
            extension: 'mp4'
          });
          if(!findvideo.length){
            findvideo = null
          }
    
          let findaudio = await Files.find({
            forslagid: req.params.forslagid,
            extension: 'mp3'
          });
          if(!findaudio.length){
            findaudio = null
          }
          res.render('info/fileeditor',{
            forslag:findForslag,
            images:findimg,
            videos:findvideo,
            sounds:findaudio,
          })
        
        }else{
          res.render('info/fileeditor',{message:"you dont have the right to edit files for this idear"})
        }
      }else{
        res.render('info/fileeditor',{message:"This release could not be located in our database."})
      }
    }else{
      res.render('info/fileeditor',{message:"This release could not be located in our database."})
    }
});

router.post('/deletefile', con.delete_file, function(req, res) {
  res.redirect('back')
});

module.exports = router;