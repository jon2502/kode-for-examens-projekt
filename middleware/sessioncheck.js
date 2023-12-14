// baseret på (kunuutkaali and jon2502.c 2023)
const session = (req, res, next) => {
    const token1 = req.session.user
    const token2 = req.session.email
    if(token1 && token2){
        next()
    }else{
        req.session.destroy()
        res.redirect('/')
    }
    
}
module.exports = session