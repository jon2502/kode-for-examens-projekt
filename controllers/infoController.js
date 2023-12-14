const forslag = require("../models/forslag.js");

Forslag = require("../models/forslag.js");
Log = require("../models/logs.js")
Comments = require("../models/comments.js")
likesdislikes = require('../models/likesdislikes.js');
Files = require("../models/files");
const cloudinary = require("cloudinary").v2;
const cloudinaryconfig = cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

module.exports = {
    changestate: async function (req, res, next) {
      state = req.params.state
      if(state >= 0 && state <= 2){
        const findforslag = await forslag.findOne({
          _id: req.params.forslagid
        })
        if(findforslag){
          req.flash('respondemail', findforslag.email)
          req.flash('responduser', findforslag.name)
          const log = new Log({
            username: req.session.user,
            state: req.params.state,
            timestamp: Date.now(),
            forslagid: req.params.forslagid
          })
          Log.create(log)
          await Forslag.updateOne({_id: req.params.forslagid},{
            state: req.params.state,
            updatedate: Date()
          });
          next()
        }else{
          req.flash('errortoken','token')
          req.flash('error', 'selected idear could not be found')
          res.redirect('/info/'+req.params.forslagid)
        }
      }else{
        req.flash('errortoken','token')
        req.flash('error', 'selected state dosent exist')
        res.redirect('/info/'+req.params.forslagid)
      }
    },

    upload_from_info: async function (req, res, next) {
    const findid = await Forslags.findOne({
          _id: req.body.forslagid,
          name: req.session.user
        });
    if(!findid){
      next()
    }else{
      setid = findid._id.valueOf()
      cloudinaryconfig
      if(req.files.length > 0){
          req.files.forEach(element => {
              cloudinary.uploader
              .upload(Object.values(element)[6],{
                resource_type: 'auto', 
                folder: 'schoolfolder'
              })
              .then(result=>{
                  var public_id = result.public_id
                  var url = result.secure_url
                  var format = result.format
                  const file = new Files({
                      link: url,
                      public_id: public_id,
                      extension: format,
                      forslagid: setid,
                      uploader: req.session.user
                    })
                    Files.create(file)
                });
          });
          next()
      }else{
          next()
      }
    }
    },
    delete_file: async function (req, res, next) {
      const findfile = await Files.findOne({
        public_id:req.body.public_id,
        uploader:req.session.user
      })
      if(findfile){
        cloudinaryconfig
        cloudinary.uploader.destroy(req.body.public_id)
        await Files.deleteOne({public_id:req.body.public_id})
        next()
      }else{
        next()
      }
      
    },
    addcoment: async function (req, res, next) {
        forslagid = req.body.forslagid
        const findForslag = await Forslag.find({_id:forslagid })
        if(findForslag){
            const newcomment = new Comments({
                username: req.session.user,
                content: req.body.comments,
                forslagid: forslagid,
                timestamp: Date.now(),
            })
            Comments.create(newcomment)
            next()
        }else{
          req.flash('errortoken','token')
          req.flash('error', 'selected forslag dosent exist')
          res.redirect('/info/'+req.body.forslagid)
        }
    },
    
    updatecoment: async function (req, res, next) {
      const findcomment = await Comments.find({
        _id:req.body.id,
        forslagid:req.body.forslagid,
        username:req.session.user
      })
      if(findcomment){
        await Comments.updateOne({_id:req.body.id},{content: req.body.comment});
        next()
      }else{
        req.flash('errortoken','token')
        req.flash('error', 'selected comment dosent exist')
        res.redirect('/info/'+req.body.forslagid)
      }
    },

    deletecoment: async function (req, res, next) {
      const findcomment = await Comments.find({
        _id:req.params.id,
        forslagid:req.body.forslagid,
        username:req.session.user
      })
      if(findcomment){
        await Comments.deleteOne({
          _id:req.params.id,
          username:req.session.user
        })
        next()
      }else{
        req.flash('errortoken','token')
        req.flash('error', 'selected comment dosent exist')
        res.redirect('/info/'+req.params.forslagid)
      }
    },

    like: async function (req, res, next) {
      forslagid = req.params.forslagid
      const findForslag = await Forslag.findOne({
        _id:forslagid
      })
      if(findForslag){
        var like_value =findForslag.like
        var dislike_value =findForslag.dislike
        const checklikedislike = await likesdislikes.findOne({
          forslagid:forslagid,
          username:req.session.user 
        })
        if(checklikedislike){
          await Forslag.updateOne({
            _id:forslagid,
            },{
            like: like_value + 1,
            dislike: dislike_value - 1
          });
          await likesdislikes.updateOne({forslagid:forslagid},{value: "like"});
          next()
        }else{
          await Forslag.updateOne({_id:forslagid},{like: like_value + 1});
          const like = new likesdislikes({
            username: req.session.user,
            forslagid:forslagid,
            value: "like"
        })
        likesdislikes.create(like)
        next()
        }
      }else{
        req.flash('errortoken','token')
        req.flash('error', 'selected forslag dosent exist')
        res.redirect('/info/'+req.body.forslagid)
      }
    },

    dislike: async function (req, res, next) {
      forslagid = req.params.forslagid
      const findForslag = await Forslag.findOne({
        _id:forslagid,
      })
      if(findForslag){
        var like_value = findForslag.like
        var dislike_value = findForslag.dislike
        const checklikedislike = await likesdislikes.findOne({
          forslagid:forslagid, 
          username:req.session.user
        })
        if(checklikedislike){
          await Forslag.updateOne({        
            _id:forslagid,
          },{
            like: like_value - 1,
            dislike: dislike_value + 1
          });
          await likesdislikes.updateOne({forslagid:forslagid},{value: "dislike"});
          next()
        }else{
          await Forslag.updateOne({_id:forslagid,},{dislike: like_value + 1});
          const dislike = new likesdislikes({
            username: req.session.user,
            forslagid:forslagid,
            value: "dislike"
        })
        likesdislikes.create(dislike)
        next()
        }
      }else{
        req.flash('errortoken','token')
        req.flash('error', 'selected forslag dosent exist')
        res.redirect('/info/'+req.body.forslagid)
      }
    },

    remove: async function (req, res, next) {
      forslagid = req.params.forslagid
      const findForslag = await Forslag.findOne({
        _id:forslagid
      })
      if(findForslag){
        var like_value = findForslag.like
        var dislike_value = findForslag.dislike
        const checklikedislike = await likesdislikes.findOne({
          forslagid:forslagid, 
          username:req.session.user
        })
        if(checklikedislike){
          if(checklikedislike.value == "like"){
            await Forslag.updateOne({_id:forslagid},
              {like: like_value - 1});
          }
          if(checklikedislike.value == "dislike"){
            await Forslag.updateOne({_id:forslagid},
              {dislike: dislike_value - 1});
          }
          await likesdislikes.deleteOne({
            forslagid:forslagid,
            username:req.session.user
          })
          next()
        }else{
          req.flash('errortoken','token')
          req.flash('error', 'somthing went wrong')
          res.redirect('/info/'+req.body.forslagid)
        }
      }else{
        req.flash('errortoken','token')
        req.flash('error', 'selected forslag dosent exist')
        res.redirect('/info/'+req.body.forslagid)
      }
    },
  }