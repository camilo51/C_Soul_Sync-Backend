require('dotenv').config();

const templates = [
    {
        name: 'forgot-password',
        template: 'template_rpva9db',
        html: (name, token) => `
            <div>
                <h1>Reset Your Password</h1>
                <p>${name}</p>
                <p>Click the link below to reset your password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
            </div>
        `
    },
    {
        name: 'verify-account',
        template: 'template_welcome123',
        html: (name, token) => `
            <div>
                <h1>Welcome to Our App!</h1>
                <p>Thank you for registering. Please verify your account by clicking the link below:</p>
                <a href="https://yourapp.com/verify-account?email={{email}}">Verify Account</a>
            </div>
        `
    }
]

module.exports = templates;