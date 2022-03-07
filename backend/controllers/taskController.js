const asyncHandler = require('express-async-handler')

const Task = require('../models/taskModel')

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find()

    res.status(200).json(tasks)
})

const getOneTask = asyncHandler(async (req, res) => {
    const task = await Task.aggregate([{$sample: {size: 1}}])

    res.status(200).json(task)
})

const addTask = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error("Can't add an empty Task.")
    }

    const task = await Task.create({
        name: req.body.name,
        tags: [req.body.tags]
    })
    
    res.status(200).json(task)
})


module.exports = {
    getTasks,
    addTask,
    getOneTask
}