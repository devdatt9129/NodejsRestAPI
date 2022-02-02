// load our app server using express somehow....
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')

const bodyParser = require('body-parser')
const { request } = require('express')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'))

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
  //request('http://127.0.0.1:5000/',function(error,response,body){
  console.log("Trying to create a new user...")
  console.log("How do we get the form data???")

  console.log("First name: " + req.body.fullname)
  var firstName = req.body.fullname
  var id=req.body.srno
  var age=req.body.year
  var resu=req.body.Radiob
  

  const queryString = "INSERT INTO coviddb(id,name,age,result) VALUES(?,?,?,?)"
  getConnection().query(queryString, [id, firstName,age,resu], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " )
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: ", results.insertId);
    res.end()
  })
  })
//})

function getConnection() {
  return mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Redemption9129@123",
    database:"final_db",
    port:"3306"
  })
}

/*app.get('/home', function(req, res) {
  request('http://127.0.0.1:5000/flask', function (error, response, body) {
      console.error('error:', error); // Print the error
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the data received
      res.send(body); //Display the response on the website
    });      
});
*/

app.get('/user/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  const connection = getConnection()

  const userId = req.params.id
  const queryString = "SELECT * FROM coviddb WHERE id = ?"
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: ")
      res.sendStatus(500)
    }

    console.log("I think we fetched users successfully");

    const users = rows.map((row) => {
      return {firstName: row.name, lastName: row.age}
    })

    res.json(users)
  })
})

app.get("/users", (req, res) => {
  const connection = getConnection()
  const queryString = "SELECT * FROM coviddb"
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " )
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
})

app.get("/", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from ROOOOOT")
})

// localhost:3003
app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})
