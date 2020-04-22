module.exports = {
  env: { 
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'standard'
  ],
  plugins: [
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'arrow-parens': [ 1, 'always' ],
    'array-bracket-spacing': [ 1, 'always' ],
    'prefer-const': [ 0 ],
    'padded-blocks': [ 1, 'never', { allowSingleLineBlocks: true } ],
    'padding-line-between-statements': [ 1,
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: 'export', next: 'export' },
      { blankLine: 'always', prev: '*', next: [ 'multiline-const', 'multiline-let', 'multiline-expression', 'multiline-block-like' ] }
    ],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0
  }
}
