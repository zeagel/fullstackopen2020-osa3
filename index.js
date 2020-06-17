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

/*
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  // Id range definition
  const min = 1
  const max = 10000
  
  let newId = null
  let resultFound = null
  
  // Draw a new id until one is found that is not in use. 
  do {
    // Generating a random integer between two values, inclusive.
    newId = Math.floor(Math.random() * (max - min + 1)) + min;
    // Confirm that the drawn id is not already in use.
    resultFound = persons.find(person => person.id === newId)
  }
  while(resultFound)

  return newId
}
*/

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
