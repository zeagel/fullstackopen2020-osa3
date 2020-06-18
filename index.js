require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Define custom token for morgan in order to log POST request data on terminal.
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

// Take middleware morgan in use and set desired log format (including POST req data)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// Take middleware cors in use and allow requests from 
// all origins to express routes of this project (for now).
app.use(cors())

// Utilize inbuild middleware 'build' of express in order to 
// display static content of frontend.
app.use(express.static('build'))

app.use(express.json())

// Display info
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
      <div>
        <p>Phonebook has info for ${ persons.length } people.</p>
        <p>${ new Date() }</p>
      </div>
    `)  
  })
})

// Display all persons from the phonebook
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Find and display one person from the phonebook
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// Delete person from the phonebook
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
    })
})

// Add new person to phonebook
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined && body.number === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
