const { Resend } = require('resend');
const templates = require('../utils/email');
require('dotenv').config();

const resend = new Resend(process.env.EMAIL_API_KEY);

const sendEmail = async ( email, name, token, templateName ) => {
    try {
        
        const template = templates.find(t => t.name === templateName);
        if (!template) throw new Error('Template not found');
        
        const html = template.html(name, token);

        const response = await resend.emails.send({
            from: 'C-Soul Sync <onboarding@resend.dev>',
            to: [email],
            subject: 'MiApp Notification',
            html
        });

        console.log('Email sent', response);
        return response;
    } catch (error) {
        console.log('Error sending email:', error);
        
        throw error;
    }
}

module.exports = {
    sendEmail
}
// MiApp onboarding@resend.dev