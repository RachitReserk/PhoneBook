app.use(express.static('dist'))
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))
const cors = require('cors')
app.use(cors())
const Contact = require('./models/contact')



const utcDate1 = new Date(Date.now())



const errorHandler = (error , request , response , next) =>
{
  console.log(error.message)
  if(error.name === 'CastError')
  {
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)



app.get('/api/persons',(request , response) => {
  Contact.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info',(request,response) =>{
    response.send(
        `<p>Phonebook has info for ${Contact.length} 
        <br/>
        <br/>
        ${utcDate1.toUTCString()} ${utcDate1.getTimezoneOffset()}</p>`
        )
})

app.get('/api/persons/:id',(request , response) => {
  Contact.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note)
    } else 
    {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response) =>
{
  Contact.findByIdAndDelete(request.params.id).then(res => {
    if(res)
    {
      console.log('Deletion successful')
    }
    else
    {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons',(request,response) => {

  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newPerson = new Contact({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedNote => {
    console.log(savedNote)
    response.json(savedNote)
})

app.put('/api/persons/:id',(request,response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id,person,{ new: true })
  .then(per => {
    response.json(person)
  })
  .catch(error => next(error))
})

})

const PORT = process.env.PORT 
app.listen(PORT , ()=> 
{
    console.log('Server Running')
})