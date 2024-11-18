const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(__dirname, "./serviceAccountKey.json"),
  projectId: "travelmate-capstone",
});

const bucketName = "userprofile-travelmate";
const bucket = storage.bucket(bucketName);

module.exports = { bucket };
