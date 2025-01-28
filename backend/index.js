const express = require('express')

const PORT = process.env.PORT || 8080

const app = express()


app.get('/',(req,res ) => {res.send("Hello")} )
app.listen(PORT, ()=> console.log("Server is working on port " + PORT))