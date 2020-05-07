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

const generateGetURL = (key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key
    };
    s3.getSignedUrl('getObject', params, (err, url) => {
      if(err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

const handlePhotoUpload = (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const timestamp = Date.now().toString();
      const fileName = `bucketFolder/${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName, type);
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  });
}


module.exports = {
  handlePhotoUpload
}
