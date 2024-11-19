const { nanoid } = require("nanoid");
const InputError = require("../exceptions/InputError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { storeData, verifyUser, getProfile, updateUser, postHistory, getHistory, getDetail } = require("../services/firestore");
require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const path = require("path");
console.log("Service account path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: "travelmate-capstone",
});

const uploadToFirebaseStorage = async (buffer, fileName) => {
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
    console.error("Error uploading file to Firebase Storage:", error);
    throw new Error("Failed to upload file.");
  }
};

const uploadFileToGCS = async (localFilePath, destinationPath) => {
  try {
    const bucketName = "userprofile-travelmate";
    const bucket = storage.bucket(bucketName);

    const [file] = await bucket.upload(localFilePath, {
      destination: destinationPath,
      predefinedAcl: "publicRead",
    });

    console.log("Upload berhasil:", file.metadata.mediaLink);
    return file.metadata.mediaLink;
  } catch (error) {
    console.error("Error saat mengunggah file ke GCS:", error.message);
    throw new Error("Gagal mengunggah file ke Google Cloud Storage.");
  }
};

const testUploadFile = async () => {
  try {
    const localFilePath = "luffy_neko.jpeg";
    const destinationPath = "profiles/test-upload.jpeg";

    const publicUrl = await uploadFileToGCS(localFilePath, destinationPath);
    console.log("File berhasil diunggah ke URL:", publicUrl);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const postUserHandler = async (request, h) => {
  const { name, email, password, image } = request.payload;
  const nameId = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  if (!name) {
    throw new InputError("Maaf, parameter nama harus diisi.");
  }
  if (!email) {
    throw new InputError("Maaf, parameter email harus diisi.");
  }
  if (!password) {
    throw new InputError("Maaf, parameter password harus diisi.");
  }
  if (!image) {
    throw new InputError("Gambar profil harus disertakan dalam format Base64.");
  }

  const buffer = Buffer.from(image, "base64");

  const profileUrl = await uploadToFirebaseStorage(buffer, `${nameId}.jpg`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    nameId,
    name,
    email,
    hashedPassword,
    profileUrl,
    createAt,
    updateAt,
  };

  await storeData(nameId, newUser);

  const token = jwt.sign({ nameId }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return h
    .response({
      status: "success",
      message: "User added successfully",
      id: nameId,
      token,
      profileUrl,
    })
    .code(201);
};

const getUserByNameHandler = async (request, h) => {
  const { name, password } = request.payload;

  if (!name) {
    throw new InputError("parameter nama tidak boleh kosong");
  }

  if (!password) {
    throw new InputError("parameter password tidak boleh kosong");
  }

  const userAccount = await verifyUser(name);

  const hasPassword = userAccount.hashedPassword;

  const isMatch = await bcrypt.compare(password, hasPassword);
  if (isMatch) {
    const token = jwt.sign({ nameId: userAccount.nameId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return h
      .response({
        status: "success",
        message: "loggin success",
        token: token,
      })
      .code(200);
  }

  throw new InputError("password incorect");
};

const getProfileHandler = async (request, h) => {
  const { nameId } = request.user;
  const data = await getProfile(nameId);

  return h.response({
    status: "success",
    data: data,
  });
};

const updateUserHandler = async (request, h) => {
  const { name, password, confirmPassword } = request.payload;

  if (!name) {
    throw new InputError("nama tidak boleh kosong");
  }

  if (!password) {
    throw new InputError("password tidak boeleh kosong");
  }

  if (!confirmPassword) {
    throw new InputError("verifikasi password tidak boeleh kosong");
  }

  if (password !== confirmPassword) {
    throw new InputError(`${password} and ${confirmPassword} not match`);
  }

  const updateAt = new Date().toISOString();

  const hashedPassword = await bcrypt.hash(password, 10);
  const newPw = {
    hashedPassword: hashedPassword,
    updateAt: updateAt,
  };
  await updateUser(name, newPw);

  return h.response({
    status: "success",
    message: "password successfully update",
  });
};

const postActivityHandler = async (request, h) => {
  const { nameId } = request.user;
  const { name, description, city, price, rating, address, comentar } = request.payload;
  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updateAt = insertedAt;

  const blob = bucket.file(`activities/${id}-${file.hapi.filename}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.hapi.headers["content-type"],
    },
  });

  await new Promise((resolve, reject) => {
    file.pipe(blobStream).on("finish", resolve).on("error", reject);
  });

  const addActivity = {
    id,
    name,
    description,
    city,
    price,
    rating,
    address,
    comentar,
    insertedAt,
    updateAt,
  };

  await postHistory(nameId, id, addActivity);

  return h
    .response({
      status: "success",
      message: "Activity added successfully",
      id: id,
    })
    .code(201);
};

const getHistoryHandler = async (request, h) => {
  const { nameId } = request.user;

  const history = await getHistory(nameId);

  if (!history) {
    throw new InputError(`${idUser} tidak memiliki history`);
  }

  return h.response({
    status: "success",
    history: history,
  });
};

const getHistoryByIdHandler = async (request, h) => {
  const { nameId } = request.user;
  const { id } = request.params;

  const detailHistory = await getDetail(nameId, id);

  return h.response({
    status: "success",
    history: detailHistory,
  });
};

module.exports = { postUserHandler, testUploadFile, getUserByNameHandler, getProfileHandler, updateUserHandler, postActivityHandler, getHistoryHandler, getHistoryByIdHandler };
