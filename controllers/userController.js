User = require("../models/user.js")
usersettings = require("../models/useroptions.js")
const bcrypt = require('bcryptjs')


module.exports = {
    login: async function (req, res, next) {
        // baseret på (kunuutkaali and jon2502.c 2023)
        let findUser = {
            username: req.body.Username,
            password: req.body.Password
          }
        const compare = await User.findOne({username: findUser.username})
        if(compare !== null){
                if(compare.status == "active"){
                    const validate = await bcrypt.compare(findUser.password, compare.password)
                    const find_settings = await usersettings.findOne({username: req.body.Username})
                    if (validate){
                        req.session.user = compare.username;
                        req.session.email = compare.email;
                        req.session.clerance = compare.clerance
                        req.session.color = find_settings.color
                        req.session.likesdislikes = find_settings.likesdislikes
                        next()
                    }else{
                        res.render('users/login', {infoMessage:"wrong username or password"})
                    }
            }else{
                res.render('users/login', {infoMessage:"user not active please activate user via email link"})
            }
        }else{
            res.render('users/login', {infoMessage:"wrong username or password"})
        }
    },

    register: async function (req, res, next) {
        if(req.body.Username !== "" && req.body.Password !=="" && req.body.Email !==""){
            if(req.body.value1 == "no color" || req.body.value1 == "color" && req.body.value2== "seperate" || req.body.value2== "score"){
                const user = new User({
                    username: req.body.Username,
                    password: req.body.Password,
                    email: req.body.Email,
                  })
                  User.create(user)
                  const useroptions = new usersettings({
                    username: req.body.Username,
                    color: req.body.value1,
                    likesdislikes: req.body.value2
                  })
                  usersettings.create(useroptions)
        
                  req.session.activationkey = req.body.Username;
                  req.flash('messagetoken','token')
                  req.flash('message', 'user created use activate user with the email send to your acount email')
                  next()
            }else{
                res.render('users/register', {infoMessage:"user option values not valid"})
            }
        }else{
            res.render('users/register', {infoMessage:"missing values"})
        }
    },

    activate: async function (req, res, next) {
        if(req.session.activationkey){
            const findUser = await User.findOne({username: req.session.activationkey})
            if(findUser.status == "active"){
                req.session.destroy()
                res.render('users/login', {infoMessage:"user already activated you can login"})
            }else{
                await User.updateOne({username: req.session.activationkey},{status:"active"})
                req.session.destroy()
                res.render('users/login', {infoMessage:"user activated you can now login"})
            }
        }else{
          req.flash('messagetoken','token')
          req.flash('message', 'session token dosent exist use "create new registration key" to create a new one"')
          next()
        }
    },

    new_activationkey: async function (req, res, next) {
        if(req.body.username == ""){
            res.render('users/newactivationkey',{info:"please insert user name into Username field before submiting form"})
        }else{
            const findUser = await User.findOne({username: req.body.username})
            if(findUser){
                if(findUser.status == "active"){
                    res.render('users/newactivationkey',{info:"user already activated you can login"})
                }else{
                    req.session.activationkey = findUser.username;
                    req.flash('messagetoken','token')
                    req.flash('message', 'new activation key created try to activate user agin with email')
                    next()
                }
            }else{
                res.render('users/newactivationkey',{info:"username dosent exist"})
            }
        }
    },

    recoversend:async function (req, res, next) {
        user = req.body.usernameforrecovery
        const finduser = await User.findOne({username: user})
        if(finduser){
            req.session.email = finduser.email;
            req.session.recoverykey = user;
            next()
        }else{
            res.render('users/recover',{info:"username dosent exist"})
        }
    },

    recover: async function (req, res, next) {
        if(req.session.activationkey){
            const findUser = await User.findOne({username: req.session.activationkey})
            if(findUser.status == "active"){
                req.session.destroy()
                res.render('users/login', {infoMessage:"user already activated"})
            }else{
                await User.updateOne({username: req.session.activationkey},{status:"active"})
                req.session.destroy()
                res.render('users/login', {infoMessage:"user activated"})
            }
        }else{
          req.flash('messagetoken','token')
          req.flash('message', 'session token dosent exist try to resent registration mail')
          next()
        }
    },

    newpassword: async function (req, res, next) {
        if(req.session.secondkey == req.session.recoverykey){
            if(req.body.newpasswordfirst == req.body.newpasswordsecond){
              const hashedpassword = await bcrypt.hash(req.body.newpasswordfirst, 10)
              await User.updateOne({username:req.session.secondkey},{password: hashedpassword});
              next()
            }else{
              res.render('users/newpassword',{user:req.session.secondkey,error:"passwords not match"})
            }
          }else{
            req.session.destroy()
            res.render('users/login',{infoMessage:'session keys not matching'})
          }
    },

    edit_user_options: async function (req, res, next) {
        if(req.body.value1 == "no color" || req.body.value1 == "color" && req.body.value2== "seperate" || req.body.value2== "score"){
            await usersettings.updateOne({username:req.session.user},{
                color: req.body.value1,
                likesdislikes: req.body.value2
            });
            req.session.color = req.body.value1
            req.session.likesdislikes = req.body.value2
            next()
        }else{
            res.render('users/register', {infoMessage:"user option values not valid"})
        }
    }
}
