
User = require("../models/user")
Useroptions = require("../models/useroptions")

const deletenonactiveusers = async function(req, res, next) {

    const one_day_old = Date.now()-1*24*60*60*1000
        const find_non_active_users = await User.find({
            creationdate: {
                $lt:one_day_old
            },
            status: "notactive"
        })
        if(find_non_active_users){
            for (user of find_non_active_users ){
                await Useroptions.deleteOne({
                    username:user.username
                })
                await User.deleteOne({
                    username:user.username
                });
            }
            next()
        }else{
            next()
        }
        
        
}
module.exports = deletenonactiveusers