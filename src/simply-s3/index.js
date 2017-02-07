
const R        = require('ramda')
const Bluebird = require('bluebird')
const AWS      = require('aws-sdk')
const uuid     = require('uuid')


// type alias S3Response =
//   { content      : Buffer
//   , content_type : String
//   }
//
// type alias SaveTextOptions =
//   { permission : String
//   , file_key   : String}
//
// type S3Config =
//   { bucket : String
//   , config : {
//       accessKeyId     : String
//     , secretAccessKey : String
//     , region          : String
//     , apiVersion      : String
//     }
//   }


const S3_PUBLIC_PERMISSION = 'public-read'
const S3_TEXT_ENCODING     = 'utf8'


AWS.config.setPromisesDependency(Bluebird)


module.exports = (S3Config) => {

  const S3 = new AWS.S3(S3Config.config)


  // generatePutParam :: String -> String
  const generatePutParam = R.curry((permission, file_key, text) => ({
    Bucket: S3Config.bucket
  , Key: file_key
  , Body: text
  , ContentType: 'text/plain'
  , ContentEncoding: 'utf8'
  , ACL: permission
  }))


  // _getObject :: String -> Promise S3Response
  const _getObject = (file_key) =>
    S3.getObject({
      Bucket: S3Config.bucket
    , Key: file_key
    }).promise()
    .then(R.applySpec({
      content: R.compose(R.prop('Body'))
    , content_type: R.prop('ContentType')
    }))
    .catch(R.always(null))


  // getText :: String -> Promise String
  const getText = (file_key) =>
    _getObject(file_key)
    .then((response) => response.content.toString(S3_TEXT_ENCODING))
    .catch(R.always(null))


  // saveText :: String -> String -> Promise String
  const saveText = R.curry(
    (text, { permission = S3_PUBLIC_PERMISSION, file_key = uuid.v4() } = {}) =>
      Bluebird.resolve(text)
      .then(generatePutParam(permission, file_key))
      .then((param) => S3.putObject(param).promise())
      .then(R.always(file_key))
      .catch(R.always(null))
  )


  return {
    getText
  , saveText
  }

}
