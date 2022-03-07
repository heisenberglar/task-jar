const express = require('express')
const router = express.Router()
const {
  getCollections,
  addCollection
} = require('../controllers/collectionController')

router.route('/starter').get(getCollections)
router.route('/').post(addCollection)

module.exports = router