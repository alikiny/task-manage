const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIPD_API_KEY);

const sendEmail=(email,subject,text,html)=>{
    sgMail.send({
        to: email,
        from: 'info@thenycode.com',
        subject: subject,
        text: text,
        html:html
    })
}

/* const msg = {
  to: 'trangkiny@gmail.com',
  from: 'info@thenycode.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail.send(msg); */
module.exports=sendEmail