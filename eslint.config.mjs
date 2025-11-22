// @ts-check
import neostandard from 'neostandard'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).prepend(
  ...neostandard()
)
