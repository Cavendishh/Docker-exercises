const express = require('express')
const router = express.Router()

const { Todo } = require('../mongo')
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  let todo
  try {
    let todo = await Todo.create({
      text: req.body.text,
      done: false,
    })

    const addedTodos = await redis.getAsync('addedTodos')
    const newAddedTodos = addedTodos ? Number(addedTodos) + 1 : 1
    await redis.setAsync('addedTodos', newAddedTodos)
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }

  res.send(todo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (!req.body) return res.status(404).end()

  if (req.body.text) req.todo.text = req.body.text
  if (typeof req.body.done !== undefined) req.todo.done = req.body.done

  const savedTodo = await Todo.findByIdAndUpdate(req.todo._id, req.todo, { new: true })

  res.send(savedTodo)
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
