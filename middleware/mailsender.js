const nodemailer = require("nodemailer");

//(nodemailer.a 2023)
const sendmail = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SERVER,
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER,
          pass: process.env.STMP,
        },
      });
    
      async function main() {
        
          if(req.session.activationkey){
              await transporter.sendMail({
                  from: process.env.USER,
                  to: req.body.Email,
                  subject: "user creation",
                  html: `<p>`+req.body.Username+` veryfie your email with the link</p>
                  <form action="https://jbspbw.onrender.com/veryfie/`+req.body.Username+`" method="post">
                      <button type="submit" value="activate user">veryfie</button>
                  </form>
                  `
                });
          }
          
          if(req.body.usernameforrecovery){
              await transporter.sendMail({
                  from: process.env.USER,
                  to: req.session.email,
                  subject: "password recovery",
                  html: `<p>`+req.session.recoverykey+` request for password recovery</p>
                  <form action="https://jbspbw.onrender.com/recover/`+req.session.recoverykey+`" method="post">
                      <button type="submit" value="recover password">recover</button>
                  </form>
                  `
                });
          }

          if(req.body.newpasswordfirst  && req.body.newpasswordsecond ){
            await transporter.sendMail({
                from: process.env.USER,
                to: req.session.email,
                subject: "password has been updated",
                text: req.session.recoverykey+" password has been updated if this was not you imediatly reset it and inform us",
                html: "<b>"+req.session.recoverykey+" password has been updated if this was not you imediatly reset it and inform us</b>",
            });
          }

          if(req.body.title && req.body.kategori && req.body.comments){
              await transporter.sendMail({
                from: process.env.USER,
                to: req.session.email,
                subject: "Forslag recived",
                html: "<b>"+req.session.user+" vi har modtaget dit forslag</b>",
              });
          }

          if(req.params.state == 2){
            await transporter.sendMail({
              from: process.env.USER,
              to: req.flash('respondemail'),
              subject: "Forslag accepted",
              html: "<b>"+req.flash('responduser')+" vi har acceptered dit forslag</b>",
          });
        }

        if(req.params.state == 1){
          await transporter.sendMail({
            from: process.env.USER,
            to: req.flash('respondemail'),
            subject: "Forslag afvist",
            html: "<b>"+req.flash('responduser')+" vi har afvist dit forslag</b>",
          });
        }

        if(req.params.state == 0){
          await transporter.sendMail({
            from: process.env.USER,
            to: req.flash('respondemail'),
            subject: "Forslag genovervejet",
            html: "<b>hej "+req.flash('responduser')+" vi har valgt at tag et kig mere på dit forslag</b>",
          });
        }
      }
      
      main().catch(console.error);
      next()
}
module.exports = sendmail