import express from 'express'
import crypto from 'node:crypto'
import { readJSON } from './utils.js'
import { validatePerson, validatePartialPerson } from './schemas/person.js'
import cors from 'cors'

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:1999',
      'http://localhost:8080'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }
  }
}))

const PORT = process.env.PORT ?? 1999
const personas = readJSON('./personas.json')

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.get('/personas', (req, res) => {
  const { gender } = req.query
  if (gender) {
    const filtrados = personas.filter(
      persona => persona.gender.toLowerCase() === gender.toLowerCase()
    )
    return res.json(filtrados)
  }
  res.json(personas)
})

app.get('/personas/:id', (req, res) => {
  const { id } = req.params
  const persona = personas.find(persona => persona.id === id)
  if (persona) return res.json(persona)
  res.status(404).json({ message: 'Persona no encontrada' })
})

app.post('/personas', (req, res) => {
  const result = validatePerson(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newPerson = {
    id: crypto.randomUUID(),
    ...result.data
  }

  personas.push(newPerson)
  res.status(201).json(newPerson)
})

app.patch('/personas/:id', (req, res) => {
  const result = validatePartialPerson(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  const personIndex = personas.findIndex(persona => persona.id === id)
  if (personIndex === -1) {
    return res.status(404).json({ message: 'Persona no encontrada' })
  }
  const updatePerson = {
    ...personas[personIndex],
    ...result.data
  }
  personas[personIndex] = updatePerson

  return res.json(updatePerson)
})

app.listen(PORT, () => {
  console.log(`Funcionando en http://localhost:${PORT}`)
})
