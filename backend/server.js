const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// Example: GET http://localhost:5001/api/type/fire
// `idOrName` can be a type name (fire) or ID (10).
app.get('/api/type/:idOrName', async (req, res) => {
  const type = encodeURIComponent(req.params.idOrName.trim().toLowerCase())

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Type not found.' })
    }

    const { half_damage_to, double_damage_from } = data.damage_relations

    res.json({
      half_damage_to: half_damage_to.map(({ name }) => name),
      double_damage_from: double_damage_from.map(({ name }) => name),
    })
  } catch (error) {
    console.error('PokéAPI request failed:', error)
    res.status(502).json({ error: 'Unable to retrieve type data from PokéAPI.' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
