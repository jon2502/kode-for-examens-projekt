const Forslagmodle = require("../models/forslag.js");
const Files = require("../models/files.js")
const Comments = require("../models/comments.js")
const likesdislikes = require("../models/likesdislikes.js")
const User = require('../models/user.js')
const useroptions = require("../models/useroptions");
const Logs = require ("../models/logs.js")

const cloudinary = require("cloudinary").v2;

const deleteuserinfo = async function(req, res, next) {
    const findForslags = await Forslagmodle.find({
        name: req.session.user
      });
    if(!findForslags.length){
        await Comments.deleteMany({username:req.session.user})

        await likesdislikes.deleteMany({username:req.session.user})

        await useroptions.deleteOne({username:req.session.user})

        await User.deleteOne({username:req.session.user})
        next()

    }else{
        for (const forslag of findForslags) {
            id=forslag._id.valueOf()
            const getfiles = await Files.find({forslagid:id})
            if(getfiles.length){
                for (const file of getfiles) {
                    public_id=file.public_id.valueOf()
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.API_KEY,
                        api_secret: process.env.API_SECRET,
                        secure: true,
                    });
                    cloudinary.uploader.destroy(public_id)
                }
                await Files.deleteMany({forslagid:id})
            }

            await Comments.deleteMany({forslagid:id})

            await Logs.deleteMany({forslagid: id})

            await likesdislikes.deleteMany({forslagid: id})

            await Forslagmodle.deleteOne({_id: id})


        }
        await Comments.deleteMany({username:req.session.user})

        await likesdislikes.deleteMany({username:req.session.user})

        await useroptions.deleteOne({username:req.session.user})

        await User.deleteOne({username:req.session.user})
        next()
    }
}
module.exports = deleteuserinfo