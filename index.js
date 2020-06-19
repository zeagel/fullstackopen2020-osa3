require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Define custom token for morgan in order to log POST request data on terminal.
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

// Take middleware cors in use and allow requests from 
// all origins to express routes of this project (for now).
app.use(cors())

// Utilize inbuild middleware 'build' of express in order to 
// display static content of frontend.
app.use(express.static('build'))

app.use(express.json())

// Take middleware morgan in use and set desired log format (including POST req data)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

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
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      console.log("no person with given id")
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// Delete person from the phonebook
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add new person to phonebook
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

// Update number for existing person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  console.log(`Update person ${body.name}, add new number ${body.number}`)

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Define error handling in middleware components

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Handling of unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError' && error.message.includes('unique')) {
    return response.status(400).send({ error: 'name must be unique' })  
  } else if (error.name === 'ValidationError' && error.message.includes('required')) {
    return response.status(400).send({ error: 'name and number are required' })  
  }

  next(error)
}

// Handling of malformatted ids
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
