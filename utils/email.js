require('dotenv').config();

const templates = [
    {
        name: 'forgot-password',
        template: 'template_rpva9db',
        html: (name, token) => `
            <style>
                *, *::after, * ::before{
                    margin: 0;
                    padding: 0;
                    font-family:Arial, Helvetica, sans-serif;
                }
            </style>
            <body>
                <div>
                    <h1 style="background-color: #101010; padding: 10px; color: #FFFFFF; text-align: center;">C-Soul Sync</h1>
                    <div style="padding: 20px; text-align: start;">
                        <p style="margin-bottom: 5px; font-weight: bold;">Hola, ${name}</p>
                        <p>Solicitud de recuperación de contraseña para tu cuenta. Has clic en el siguiente botón para continuar con la recuperación</p>
                        <div style="display: flex; justify-content: center; align-items: center;">
                            <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" style="padding: 15px; display: inline-block; background-color: #101010; color: #FFFFFF; text-decoration: none; border-radius: 5px; font-weight: bold; margin-block: 20px">Recuperar Contraseña</a>
                        </div>
                        <p>Si usted no solicitó esta acción, no se requiere hacer nada.</p>

                        <p style="margin-top: 10px; font-size: 13px;">En caso de que el boton anterior no funcione, utilice este enlace</p>
                        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" style="font-size: 13px;">${process.env.FRONTEND_URL}/reset-password?token=${token}</a>
                    </div>
                </div>
            </body>
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