import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP } from 'better-auth/plugins'
import { db } from './db'
import { sendVerificationOTPEmail } from './email'
import * as authSchema from '@@/server/db/schema/auth-schema'
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...authSchema,
      user: authSchema.userTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    async sendVerificationEmail ({ url, user }) {
      sendVerificationEmail({
        email: user.email,
        url,
      })
    }
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true, // Just when email is not verified
    },
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP ({ email, otp, type }) {
        if (type === 'email-verification') {
          sendVerificationOTPEmail({
            email,
            otp,
          })
        }
      },
      expiresIn: 600,
      // sendVerificationOnSignUp: true
    }),
  ],
})
