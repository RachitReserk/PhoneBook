const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to MONGODB')

mongoose.connect(url)
.then(res => {
    console.log('Connected to MongoDB')
})
.catch((error) => {
    console.log('ERROR CONNECTING TO MONGODB:', error.message)
})

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: (v) => {
            return /\d{3}|\d{2}-\d{8}/.test(v);
        }
    },

})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Contact',contactSchema)