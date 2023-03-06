const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzjjck3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allTodosCollection = client.db('todoChecklist').collection('allTodos');
        app.post('/allTodos', async (req, res) => {
            const todos = req.body;
            const result = await allTodosCollection.insertOne(todos);
            res.send(result);
        })
        app.get('/alltodos/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const todos = await allTodosCollection.findOne(query)
            res.send(todos);
        })

        app.get('/alltodos', async (req, res) => {
            const query = {}
            const options = await allTodosCollection.find(query).toArray();
            res.send(options);
        })

        app.put('/alltodos/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedTask = req.body;
            const option = { upsert: true };
            const updatedTasks = {
                $set: {
                    taskname: updatedTask.taskname,
                    description: updatedTask.description
                }
            }
            const result = await allTodosCollection.updateOne(filter, updatedTasks, option)
            res.send(result)
        })


        app.delete('/alltodos/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const result = await allTodosCollection.deleteOne(filter);
            console.log(result);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.log())



app.get('/', async (req, res) => {
    res.send("Todo App runing on server")
})
app.listen(port, () => {
    console.log(`Todo App runing on ${port}`);
})
