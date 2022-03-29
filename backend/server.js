const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const path = require('path')
const connectDB = require('./config/db')
const cors = require('cors');
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServer, gql } = require('apollo-server-express');
const Task = require('./models/taskModel')
const Project = require('./models/projectModel')
const Collection = require('./models/collectionModel')

connectDB()

const startApolloServer = async () => {
    const app = express();
    app.use(cors())

    const typeDefs = gql`
        type Query {
            tasks: [Task]
            collections: [Collection]
            projects: [Project]
        }

        type Task {
            name: String
        }
        
        type Collection {
            name: String,
            tasks: [Task]
        }
        
        type Project {
            name: String,
            collections: [Collection]
        }
    `

    const resolvers = {
        Query: {
            tasks: async () => {
                const tasks = await Task.find()
                return tasks
            },
            collections: async () => {
                const collections = await Collection.find().populate('tasks')
                return collections
            },
            projects: async () => {
                const projects = await Project.find().populate({
                    path: 'collections',
                    populate: {
                        path: 'tasks'
                    }
                })
                return projects
            }
        }
    }

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })

    const server = new ApolloServer({schema});
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    })
}

startApolloServer()