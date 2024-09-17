const mongoose = require('mongoose')
require('dotenv').config();

async function main () {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.CONNECTION_STRING)
            .then(() => {
                console.log('Connected to Mongo\n')
            })
            .catch((error) => {
                console.error('Connection error: ' + error)
            })
    } catch (error) {
        console.error('Erro conn: ' + error)
    }
}

module.exports = main