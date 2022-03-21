const asyncHandler = require('express-async-handler')
const Collection = require('../models/collectionModel.js')

const getCollections = asyncHandler(async (req, res) => {
    const collection = await Collection.find()

    res.status(200).json(collection)
})

const addCollection = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error("Can't add an empty collection.")
    }

    const collection = await Collection.create({
        name: req.body.name,
        tasks: [req.body.tasks]
    })

    res.status(200).json(collection)
})

module.exports = {
    getCollections,
    addCollection
}