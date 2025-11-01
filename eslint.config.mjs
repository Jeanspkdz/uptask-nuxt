// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import neostandard from 'neostandard'

export default withNuxt(
  // Your custom configs here
  ...neostandard(),
  {
    rules: {
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off'
    }
  }
)
