const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "6789 557 999",
    id: 1
  },
  {
    name: "Dan Brown",
    number: "77 88 99 112",
    id: 2
  },
  {
    name: "Kimi Räikkönen",
    number: "+99-44-22-333",
    id: 3
  },
  {
    name: "Sebastian Vettel",
    number: "+67-666-99-1111",
    id: 4
  }
]

app.get('/info', (request, response) => {
  response.send(`
      <div>
        <p>Phonebook has info for ${ persons.length } people.</p>
        <p>${ new Date() }</p>
      </div>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => {
    return person.id === id
  })

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

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

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Confirm that all mandatory fields have been given.
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'All fields must be filled.'
    })
  }

  // Confirm that the given name is not on the phonebook already.
  const resultFound = persons.find(person => (person.name).toLowerCase() === (body.name).toLowerCase())
  if (resultFound) {
    return response.status(400).json({
      error: 'Name must be unique.'
    })
  }

  // Create new person object with given details.
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  response.json(persons)
}) 

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
