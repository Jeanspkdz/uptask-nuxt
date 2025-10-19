import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP } from 'better-auth/plugins'
import { db } from './db'
import { sendVerificationEmail, sendVerificationOTPEmail } from './email'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ url, user }) => {
      await sendVerificationEmail({
        email: user.email,
        url,
      })
    }
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP ({ email, otp, type }) {
        if (type === 'email-verification') {
          await sendVerificationOTPEmail({
            email,
            otp
          })
        }
      },
      expiresIn: 600
    })
  ]
})
