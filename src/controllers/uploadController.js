const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const giveCurrentDateTime = require('../utils/dateUtils');

const firebaseConfig = require('../config/firebaseConfig');
const firebaseapp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseapp);

const uploadController = {
    upload_file: async(req, res) => {
        try {
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(storage, `files/${req.file.originalname + "_" + dateTime}`);
            const metaData = {
                contentType: req.file.mimetype,
            };
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metaData);
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File successfuly uploaded');

            return res.send({
                message: 'file uploaded to firebase storage',
                name: req.file.originalname,
                type: req.file.mimetype,
                downloadURL: downloadURL
            })
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    }
}

module.exports = uploadController;