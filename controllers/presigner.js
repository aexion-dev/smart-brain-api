const AWS = require('aws-sdk');
const fs = require('fs');
const bluebird = require('bluebird');
const fileType = require('file-type');
const multiparty = require('multiparty');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

AWS.config.setPromisesDependency(bluebird);

const s3 = new AWS.S3();

const generateGetURL = (Key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key
    };
    s3.getSignedUrl('getObject', params, (err, url) => {
      if(err) {
        reject(err);
      } else {
        console.log(url)
        resolve(url);
      }
    });
  });
}

const generatePutURL = (Key, ContentType) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key,
      ContentType
    };
    s3.getSignedUrl('putObject', params, (err, url) => {
      if(err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

const handleAWSGetURL = (req, res) => {
  const { Key } = req.query;
  generateGetURL(Key)
    .then(getURL => {
      res.send(getURL);
    })
    .catch(err => {
      res.send(err);
    })
}

const handleAWSPutURL = (req, res) => {
  const { Key, ContentType } = req.query;
  console.log(req.query);
  generatePutURL(Key, ContentType)
    .then(putURL => {
      res.send(putURL);
    })
    .catch(err => {
      res.send(err);
    })
}

module.exports = {
  handleAWSGetURL,
  handleAWSPutURL
}
