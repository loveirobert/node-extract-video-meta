module.exports = {
    extends: ['airbnb/base'
  ],
    plugins: [],
    parser: 'babel-eslint',
    parserOptions: {
      "ecmaVersion": 7,
      ecmaFeatures: {
        experimentalObjectRestSpread: true,
        generators: true,
    }
  },
    settings: {},
    globals: {
      SyntheticInputEvent: true,
  },
    rules: {
      'no-console': 2,
      'consistent-return': 0,
      'id-length': 0,
      'max-len': 0,
      'no-underscore-dangle': 0,
      'import/extensions': 0,
      'arrow-body-style': 0,
      'no-param-reassign': 0,
      'no-control-regex': 0,
      'no-await-in-loop': 0,
      'semi': 0,
      'arrow-parens': ['error', 'always'
    ],
      'no-plusplus': [
      "error",
      {
        "allowForLoopAfterthoughts": true
      }
    ],
    "no-shadow": [
      "error",
      {
        "allow": [
          "resolve",
          "reject",
          "done",
          "cb",
          "err"
        ]
      }
    ],
    "quote-props": [
      "error",
      "as-needed",
      {
        "numbers": true
      }
    ],
    "no-use-before-define": [
      "error",
      {
        "functions": false,
        "classes": false
      }
    ]
  },
}
