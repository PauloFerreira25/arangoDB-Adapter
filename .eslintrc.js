module.exports = {
  "extends": "standard",
  "env": {
    "node": true,
    "mocha": true
  },
  "plugins": [
    "mocha"
  ],
  "rules": {
    "mocha/no-exclusive-tests": "error",
    "no-unused-vars": [
      "error",
      { "varsIgnorePattern": "should|expect" }
    ]
  }
};
