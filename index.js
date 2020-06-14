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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
