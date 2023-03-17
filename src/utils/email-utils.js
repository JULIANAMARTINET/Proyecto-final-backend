import {Loggers} from '../loggers/loggers.js'
import { createTransport } from 'nodemailer'
import { config } from '../config/index.js';

 const transporter = createTransport({
     service: 'gmail',
     port: 587,
     auth: {
         user: config.MAIL.USER,
         pass: config.MAIL.PASS,
     }
 });

const sendEmail = async (mailTo, subject, html) => {
    try {
        const mailOptions = {
            from: config.MAIL.USER,
            to: mailTo,
            subject: subject,
            html: html,
        }

        const info = await transporter.sendMail(mailOptions)

    } catch (error) {
        Loggers.logError('error from sendEmail: ' + error)
    }
}



export const EMAIL_UTILS = { sendEmail }