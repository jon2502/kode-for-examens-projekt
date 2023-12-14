const cloudinary = require("cloudinary").v2;
Files = require("../models/files");

module.exports = {
    upload: async function (req, res, next) {
            const findid = await Forslags.findOne({
                title: req.body.title,
                name: req.session.user,
                email: req.session.email,
                kategori: req.body.kategori,
                comments: req.body.comments,
            });
            if(!findid){
                req.flash('errortoken','token')
                req.flash('error', 'somthing went wrong when uploading images go into your proposals and uploade them manually')
                res.redirect('/forslag/list/0')
            }else{
            setid = findid._id.valueOf()
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
                secure: true
            });
            if(req.files.length > 0){
                req.files.forEach(element => {
                    cloudinary.uploader
                    .upload(Object.values(element)[6],{
                        folder: 'schoolfolder'
                    })
                    .then(result=>{
                        var public_id = result.public_id
                        var url = result.url
                        var format = result.format
                        const file = new Files({
                            link: url,
                            public_id: public_id,
                            extension: format,
                            forslagid: setid,
                            uploader: req.session.user
                          })
                          Files.create(file)
                          next()
                    });
                });
            }else{
                next()
            }
        }
    },

 
}



