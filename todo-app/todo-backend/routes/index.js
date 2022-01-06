const express = require('express')
const router = express.Router()

const redis = require('../redis')
const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
  })
})

/* GET todo statistics data. */
router.get('/statistics', async (req, res) => {
  let addedTodos
  try {
    addedTodos = await redis.getAsync('addedTodos')
    if (addedTodos === null) addedTodos = 0
    addedTodos = Number(addedTodos)
  } catch (err) {
    console.error('err', err)
    throw new Error(err)
  }

  res.send({
    added_todos: addedTodos,
  })
})

module.exports = router
