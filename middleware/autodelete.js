const Forslagmodle = require("../models/forslag.js");
const Files = require("../models/files.js")
const logs = require("../models/logs.js")
const Comments = require("../models/comments.js")
const likesdislikes = require("../models/likesdislikes.js")
const cloudinary = require("cloudinary").v2;

const autodelete = async function(req, res, next) {
    //først hent alle forslag der er over hvis dato og er accepted eller pending
    //slet alle cloudinary filler
    //derfeter slet alle filler med den forslags id
    //sley alle commentare, logs og likesdislike med forslagid 
    //tilsidst slet alle forslag 

    const five_days_old = Date.now()-5*24*60*60*1000
    const findForslags = await Forslagmodle.find({
        updatedate: {
            $lt:five_days_old
        },
        state: {
            $gt:0
        }
      });
    if(!findForslags.length){
        next()
    }else{
        for (const forslag of findForslags) {
            id=forslag._id.valueOf()
            const getfiles = await Files.find({
                forslagid:id
            })
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
                await Files.deleteMany({
                    forslagid:id
                })
            }
            await logs.deleteMany({
                forslagid:id
            })

            await Comments.deleteMany({
                forslagid:id
            })

            await likesdislikes.deleteOne({
                _id: id
            })

            await Forslagmodle.deleteOne({
                _id: id
            })
        }
        next()
    }
}
module.exports = autodelete