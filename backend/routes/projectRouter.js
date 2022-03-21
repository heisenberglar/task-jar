const express = require('express')
const router = express.Router()
const {
  getStarterProject
} = require('../controllers/projectController')

router.route('/starter').get(getStarterProject)

module.exports = router