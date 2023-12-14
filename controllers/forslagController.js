
const cloudinary = require("cloudinary").v2;
Forslags = require("../models/forslag.js");
Logs = require("../models/logs.js")
Files = require("../models/files");

module.exports = {
    newForslag: async function (req, res, next) {
        //skab ny forslag på database
        if(req.body.title !== "" && req.body.title !== "" && req.body.comments !== ""){
          const forslag = new Forslags({
            title: req.body.title,
            name: req.session.user,
            email: req.session.email,
            kategori: req.body.kategori,
            comments: req.body.comments,
          })
          Forslags.create(forslag)
          id = forslag._id.valueOf()
          if(req.files){
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
                secure: true
            });
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
                          forslagid: id,
                          uploader: req.session.user
                        })
                        Files.create(file)
                    });
                });
            next()
          }else{
            next()
          }
        }else{
          res.render('forslag/form', {infoMessage:"missing values"})
        }
    },
  }