const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3alwu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
       await client.connect();
     const partCollection = client.db('motor_bike_portal').collection('parts');
   
     const serviceCollection = client.db('motor_bike_portal').collection('service');
   
     app.get('/part', async(req, res) =>{
       const query = {};
       const cursor = partCollection.find(query);
       const parts = await cursor.toArray();
       res.send(parts);
   });

   app.post('/service', async(req, res)=>{
     const service = req.body;
     const query = {booking: service.booking, client: service.client}
     const exists = await serviceCollection.findOne(query);
     if(exists){
       return res.send({success: false, service:exists})
     }
     const result = await serviceCollection.insertOne(service);
    return res.send({success: true, result});
   })

  }
  finally{
      
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Motor Bike app listening on port ${port}`)
})