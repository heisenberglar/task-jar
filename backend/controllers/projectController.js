const asyncHandler = require('express-async-handler')
const Project = require('../models/projectModel.js')
const Collection = require('../models/collectionModel')

const getStarterProject = asyncHandler(async (req, res) => {
    const starterProject = await Project.findOne({name:"Starter"}).populate({
        path: "collections",
        populate: {
            path: 'tasks'
        }
    })
    res.status(200).json(starterProject)
})

module.exports = {
    getStarterProject,
}