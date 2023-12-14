// baseret på (kunuutkaali and jon2502.c 2023)
const logincheck = (req, res, next) => {
    const token1 = req.session.user
    const token2 = req.session.email
    if(token1 && token2){
        res.redirect('/forslag/list/0')
    }else{
        next()
    }
}
module.exports = logincheck