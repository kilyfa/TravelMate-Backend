const { Firestore } = require("@google-cloud/firestore");
const InputError = require("../exceptions/InputError");
const ClientError = require("../exceptions/ClientError");
require('dotenv').config()

const db = new Firestore({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

async function storeData(id, data) {
    try {
        const userColection = db.collection('users');
        return userColection.doc(id).set(data);
    } catch (error) {
        throw new ClientError('unable save data');
    }
};

const verifyUser = async (username) => {
    const userAccount = db.collection('users').where('name', '==', username).limit(1);
    const data = await userAccount.get();
    if (data.empty) {
        throw new InputError('user tidak ditemukan');
    }
    const user = data.docs[0].data();
    
    return user;
};

const getProfile = async (nameId) => {
    const userAccount = await db.collection('users').doc(nameId).get();

    if (!userAccount.exists) {
        throw new ClientError('Profile not found');
    }

    const data = userAccount.data();
    return data;
}

const updateUser = async (account, data) => {
    try {
        const userAccount = await verifyUser(account);
        const document = db.collection('users').doc(userAccount.nameId);
        await document.update(data);
    } catch (error) {
        throw new ClientError(error);
    }
}

const postHistory = async (nameId, historyId, historyData) => {
    try {
        const userDoc = db.collection('users').doc(nameId);
        const historiesCollection = userDoc.collection('history');
        return historiesCollection.doc(historyId).set(historyData);
    } catch (error) {
        throw new ClientError('unable to save data');
    }
}

const getHistory = async (id) => {
    const data =  db.collection('users').doc(id);
    const history = await data.collection('history').get();
    if (history.empty) {
        throw new ClientError('gagal memuat database');
    }

    return history.docs.map(doc => ({
        ...doc.data()
    }));
}

const getDetail = async (nameId, historyId) => {
    const userAccount = db.collection('users').doc(nameId);
    if (!userAccount) {
        throw new ClientError('user not fount', 404);
    }
    const history = await userAccount.collection('history').doc(historyId).get();
    if (!history) {
        throw new ClientError(' unable to load data', 404);
    }
    return history.data();
}

module.exports = { storeData, verifyUser, getProfile, updateUser, postHistory, getHistory, getDetail };