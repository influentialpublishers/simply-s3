
import test from 'ava'

const R        = require('ramda')
const SimplyS3 = require('../../src/simply-s3')


const config = {}
const ss3    = SimplyS3(config)


test('getText should be a function', t => {
  t.true(R.is(Function, ss3.getText))
})


test('getText should return null if S3 is misconfigured', t => {
  return ss3.getText('123')
  .then((result) => {
    t.is(null, result)
  })
})


test('saveText should be a function', t => {
  t.true(R.is(Function, ss3.saveText))
})


test('saveText should return null if S3 is misconfigured', t => {
  return ss3.saveText('123')
  .then((result) => {
    t.is(null, result)
  })
})
