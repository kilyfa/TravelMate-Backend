const { Storage } = require("@google-cloud/storage");
const ClientError = require("../exceptions/ClientError");

const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const uploadIImageToGCS = async (buffer, fileName) => {
    try {
        const bucketName = "userprofile-travelmate";
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`profiles/${fileName}`);
        const blobStream = file.createWriteStream({
        resumable: false,
        });

        await new Promise((resolve, reject) => {
        blobStream.end(buffer).on("finish", resolve).on("error", reject);
        });

        return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    } catch (error) {
        throw new ClientError("Failed to upload file.");
    }
};

module.exports = uploadIImageToGCS;