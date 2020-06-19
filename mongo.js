/* global process */

const mongoose = require('mongoose')

// Validate that correct amount of arguments are given.
if (process.argv.length === 3 || process.argv.length === 5) {

  const password = process.argv[2]

  const url =
    `mongodb+srv://fso2020-mho-dev:${password}@cluster0-nscn5.mongodb.net/puhelinluettelo-app?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  // Five parameters given -> Add new person
  if (process.argv.length === 5) {

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })

    person.save().then(_response => {
      console.log(`\nAdded ${process.argv[3]} number ${process.argv[4]} to phonebook\n`)
      mongoose.connection.close()
    })
  // Three parameters given -> list all persons
  } else if (process.argv.length === 3) {

    console.log('\nPhonebook:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`- ${person.name} ${person.number}`)
      })
      console.log('\n')
      mongoose.connection.close()
    })
  }
// Syntax error -> print error message and exit.
} else {
  console.log('\nSyntax error! Usage: $ node mongo.js {yourpassword} {name} {number}\n')
  process.exit(1)
}

