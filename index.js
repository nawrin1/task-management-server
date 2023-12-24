const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqv383i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
const dbConnect = async () => {
    try {
        client.connect()
        console.log('DB Connected Successfully')
    } catch (error) {
        console.log(error.name, error.message)
    }
  }
dbConnect()



const userCollection=client.db("Task-Management").collection("user")
const taskCollection=client.db("Task-Management").collection("task")
app.post('/users',async(req,res)=>{
    const user=req.body
    const query={email:user.email}
    const exist=await userCollection.findOne(query)
    if (exist){
      return res.send({ message: 'user exists', insertedId: null })
  
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
  
  })
  app.post('/tasks',async(req, res) => {
   
    const data= req.body;
    console.log(data,"task from backend")
  
    const result = await taskCollection.insertOne(data);
    res.send(result);
  });
  
  app.get('/users', async (req, res) => {
    console.log(req.headers, "user from backend");

  
    const result = await userCollection.find().toArray();
    res.send(result);
  });
  app.get('/tasks', async (req, res) => {
    const email=req.query.email
    console.log(email,"email")
    const filter={email:email}
    // console.log(req.headers, "task from backend");

  
    const result = await taskCollection.find(filter).toArray();
    res.send(result);
  });
  app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const filter= { _id: new ObjectId(id) }
    console.log(filter,"from del backend")
    const result = await taskCollection.deleteOne(filter)
   
    res.send(result);



  })
  app.patch('/tasks/:id', async (req, res) => {
    const item = req.body;
    const id = req.params.id;
    console.log('inside update')
    const filter = { _id: new ObjectId(id) }
    const updatedDoc = {
      $set: {
        title: item.title,
        
        description: item.description,
       
       deadline:item.deadline,
       priority:item.priority
        
      }
    }
    console.log(updatedDoc)

    const result = await taskCollection.updateOne(filter, updatedDoc)
    console.log(result)
    res.send(result);
  })
  app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await taskCollection.findOne(query);
    console.log(result,"found")
    res.send(result);
  })
app.get('/', async(req, res) => {
    res.send('task is sitting')
  })

app.listen(port,()=>{
    console.log(`port running ${port}`)
})
