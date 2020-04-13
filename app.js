const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
    let output = `
    <p> You have a new contact request </p>
    <h3>Contact Details</h3>
    <ul>
        <li>Company name: ${req.body.company}</li>
        <li>Your name: ${req.body.name}</li>
        <li>Your e-mail: ${req.body.email}</li>
        <li>Your phone: ${req.body.phone}</li>
    </ul>
        <h3>Your message:</h3>
        <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        service: 'Gmail',
        auth: {
            user: 'jakubstawowczyk1@gmail.com',
            pass: 'stawo123#@!',
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    let mailOptions = {
        from: '"Nodemailer Contact" <jakubstawowczyk1@gmail.com>',
        to: 'jakubstawowczyk1@gmail.com', 
        subject: 'Node',
        text: 'Hello world?',
        html: output
    };

transporter.sendMail(mailOptions, (error,info) => {
    if (error) {
        // return console.log(error);
        console.log(error);
        throw new Error('failed');
    }
    console.log('Message sent: %s', info.response);
    console.log('Preview URL: %s', nodemailer.getTestMessagerUrl(info));
    res.render('contact', {msg: 'Email has been sent'});

});
});

app.listen(3000, () => console.log('Server started...'));

