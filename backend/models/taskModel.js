const mongoose = require('mongoose')

const taskSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag"
            }
        ]
    }
)

module.exports = mongoose.model('Task', taskSchema)