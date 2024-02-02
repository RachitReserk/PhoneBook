const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://trachit752:${password}@phonebook.gydc8wm.mongodb.net/contacts?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact',contactSchema)

if(process.argv.length <= 3)
{
    console.log('Phonebook:-')
Contact.find({}).then(res => {
    res.forEach(con => {
        console.log(con.name+" "+con.number)
    })
    mongoose.connection.close()
})

}
else
{

const nameINP = process.argv[3]
const numberINP = process.argv[4]

const contact = new Contact({
    name:nameINP,
    number:numberINP,
})

contact.save().then(res => {
    console.log(`added ${nameINP} number ${numberINP} to phonebook`)
    mongoose.connection.close()
})
}