import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: +process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

type SendVerificationOTMEmailParams = { email: string; otp: string }

export const sendVerificationOTPEmail = async ({ email, otp }: SendVerificationOTMEmailParams) => {
  const confirmUrl = `${process.env.NUXT_BASE_URL}/auth/confirm-account?email=${encodeURIComponent(
    email
  )}&otp=${encodeURIComponent(otp)}`

  await transport.sendMail({
    from: 'UpTask <admin@uptask.com>',
    to: email,
    subject: 'UpTask - Verify your account',
    text: `Your UpTask verification code is: ${otp}\nEnter it at: ${confirmUrl}`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #a78bfa;">Verify your email</h2>
      <p>Use the following verification code to confirm your account:</p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="font-size: 26px; font-weight: bold; letter-spacing: 4px; color: #a78bfa;">${otp}</span>
      </div>
      <p>Once you have your code, go to the following page and enter it:</p>
      <p style="text-align: center; margin: 16px 0;">
        <strong><a href="${confirmUrl}" style="color: #a78bfa;">${confirmUrl}</a></strong>
      </p>
      <p>This code will expire in 10 minutes.</p>
      <p style="margin-top: 16px; font-size: 14px; color: #555;">
        If you didn’t request this email, please ignore it.
      </p>
    </div>
  `,
  })
}

type SendVerificationEmailParams = { email: string; url: string }
export const sendVerificationEmail = async ({ email, url }: SendVerificationEmailParams) => {
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
