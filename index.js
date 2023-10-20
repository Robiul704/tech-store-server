const express = require('express')
const cors=require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://robiul:robiulislam@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();

    const productcollection=client.db('productDB').collection('product')
    const brandcollection=client.db('productDB').collection('Brand')
    const bannercollection=client.db('productDB').collection('banner')
    const mycartcollection=client.db('productDB').collection('mycart')
 

    app.post('/product',async(req,res)=>{
        const product=req.body
        const result=await productcollection.insertOne(product)
        res.send(result)
    })
    app.post('/mycart',async(req,res)=>{
      const product=req.body
      const result=await mycartcollection.insertOne(product)
      res.send(result)
    })
    app.get('/mycart',async(req,res)=>{
      const finding=mycartcollection.find()
      const result=await finding.toArray()
      res.send(result)
    })
    
    app.delete('/mycart/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await mycartcollection.deleteOne(query)
      res.send(result)
    })

    app.get('/mycart/:name',async(req,res)=>{
      const query=req.params.name
      console.log(query)
      const filter={name:query}
      const result=await mycartcollection.find(filter).toArray()
      res.send(result)
    })
    

    app.get('/product',async(req,res)=>{
        const query=productcollection.find()
        const result=await query.toArray()
        res.send(result)
      
    })

    app.get('/brand',async(req,res)=>{
      const finding=brandcollection.find()
      const result=await finding.toArray()
      res.send(result)
    })

    app.get('/product/:brand',async(req,res)=>{
      const query=req.params.brand
      console.log(query)
      const filter={brand:query}
      const result=await productcollection.find(filter).toArray()
      res.send(result)
    })
    app.get('/products/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const result=await productcollection.findOne(filter)
      res.send(result)
    })

    app.get('/banner',async(req,res)=>{
      const finding=bannercollection.find()
      const result=await finding.toArray()
      res.send(result)
    })

    app.get('/banner/:brand',async(req,res)=>{
      const query=req.params.brand
      console.log(query)
      const filter={brand:query}
      const result=await bannercollection.find(filter).toArray()
      res.send(result)
    })
    
    app.put('/product/:id',async(req,res)=>{
      const query=req.params.id
      const filter={_id:new ObjectId(query)}
      const option={upsert:true}
      const body=req.body
      console.log(body)
      const updatenew={
        $set:{
          name:body.name,
          image:body.image,
          price:body.price,
          brand:body.brand,
          type:body.type,
          rating:body.rating,
          description:body.description,
        }
      }
      const result=await productcollection.updateOne(filter,updatenew,option)
      res.send(result)
    })
   
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})