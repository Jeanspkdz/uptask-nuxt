import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: +process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendEmail = async ({ email, url }: { email: string; url: string }) => {
  await transport.sendMail({
    from: 'UpTask <admin@uptask.com>',
    to: email,
    subject: 'UpTask - Confirm your account',
    text: `UpTask - Confirm your account: ${url}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #a78bfa;">Confirm your account</h2>
        <p>Please click the button below to verify your email and activate your account.</p>
        <a href="${url}" 
          style="display: inline-block; background-color: #a78bfa; color: white; 
                  padding: 10px 20px; text-decoration: none; border-radius: 6px; 
                  font-weight: bold;">
          Confirm Account
        </a>
        <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${url}" style="color: #a78bfa;">${url}</a></p>
      </div>
    `,
  })
}
