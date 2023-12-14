var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')

const con = require("../controllers/userController")

const forslag = require("../models/forslag")
const likesdislikes = require("../models/likesdislikes")
const logs = require('../models/logs.js')
const Users = require("../models/user.js")

const sessionauth = require("../middleware/sessioncheck")
const logincheck = require("../middleware/logincheck.js")
const delteuser = require('../middleware/deleteuser.js')
mails = require("../middleware/mailsender.js")

router.get('/',logincheck, function(req,res){
  if(req.flash('messagetoken')){
    res.render('users/login',{infoMessage:req.flash('message')[0]})
  }else{
    res.render('users/login')
  }

})

router.post('/login',logincheck, con.login, function(req,res){
  res.redirect('/forslag/list/0')
})

router.get('/register',logincheck, function(req,res){
  res.render('users/register')
})

router.get('/recover',logincheck, function(req,res){
  res.render('users/recover')
})

router.post('/recover', con.recoversend, mails, function(req,res){
  req.flash('messagetoken','token')
  req.flash('message', 'email for recovery of password send')
  res.redirect('/')
})

router.get('/new_activation_key',logincheck, function(req,res){
  res.render('users/newactivationkey')
})

router.post('/new_activation_key',logincheck, con.new_activationkey, function(req,res){
  res.render('users/newactivationkey.pug')
})

router.post('/recover/:user', logincheck, async function(req,res){
  req.session.secondkey = req.params.user
  if(req.session.secondkey == req.session.recoverykey){
    username = req.session.secondkey
    res.render('users/newpassword',{user:username})
  }else{
    req.session.destroy()
    res.render('users/login',{infoMessage:'session keys not matching'})
  }
})

router.post('/newpassword',logincheck, con.newpassword, mails, async function(req,res){
  req.session.destroy()
  res.render('users/login',{infoMessage:'password updated'})
})

router.post('/register',logincheck, con.register,mails, function(req,res){
  res.redirect('/')
})

router.post('/register',logincheck, con.recoversend,mails, function(req,res){
  res.redirect('/')
})

router.post('/veryfie/:user',logincheck, con.activate,  function(req,res){
  res.redirect('/')
})

router.get('/logout', (req, res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/profile',sessionauth, async function(req,res){
  const clerance = req.session.clerance
  const user = req.session.user
  var finduserforslag = await forslag.find({
    name:user
  })
  if(!finduserforslag.length){
    finduserforslag = null
  }

  const color_option = req.session.color
  const likesdislikes_option = req.session.likesdislikes

  if( clerance === 'user'){
    likes = []
    dislikes = []
    const checklikedislike = await likesdislikes.find({
      username:req.session.user 
    })
    checklikedislike.forEach(content => {
      if(content.value == 'like'){
        likes.push(content.forslagid)
      }

      if(content.value == 'dislike'){
        dislikes.push(content.forslagid)
      }
    });
    var finduserlikes = await forslag.find({
      _id: {$in:likes}
    })
    if(!finduserlikes.length){
      finduserlikes = null
    }

    var finduserdislikes = await forslag.find({
      _id: {$in:dislikes}
    })
    if(!finduserdislikes.length){
      finduserdislikes = null
    }
    res.render('users/profile',{
      clerance:clerance,
      display:finduserforslag,
      likes:finduserlikes,
      dislikes:finduserdislikes,
      color_option:color_option,
      likesdislikes_option:likesdislikes_option
    })
    }
  if(req.session.clerance === 'admin'){
    logarray = []
    const checklogs = await logs.find({
      username:req.session.user 
    })
    if(checklogs.length > 0){
      checklogs.forEach(content => {
        logarray.push(content.forslagid)
      })
      var finduserlogsforslag = await forslag.find({
        _id: {$in:logarray}
      })
      if(!finduserlogsforslag.length){
        finduserlogsforslag = null
      }
      var findalllogs = await logs.find({
        forslagid: {$in:logarray}
      })
      if(!findalllogs.length){
        findalllogs = null
      }
      res.render('users/profile',{
        clerance:clerance,
        display:finduserforslag,
        logedforslag:finduserlogsforslag,
        alllogs:findalllogs,
        color_option:color_option,
        likesdislikes_option:likesdislikes_option
      })
    }else{
      res.render('users/profile',{clerance:clerance,display:finduserforslag})
    }
  }
})

router.post('/delete',sessionauth,delteuser,async function(req,res){
  req.session.destroy()
  res.redirect('/')
})

router.get('/edit_user_settings',sessionauth, async function(req,res){
  res.render('users/useroptions')
})

router.post('/user_settings_changes',sessionauth,con.edit_user_options,async function(req,res){
  res.redirect('/profile')
})
module.exports = router;
