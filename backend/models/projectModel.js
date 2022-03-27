
const mongoose = require('mongoose')

const projectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        collections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Collection"
            }
        ]
    }
)

module.exports = mongoose.model('Project', projectSchema)