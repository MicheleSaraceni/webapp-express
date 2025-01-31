# template-express

## Step 1 - Scaffolding

```bash
# clono la repository
# aggiungo package-lock.json to .gitignore
# edit README.md

# creo il file server.js
ni server.js

#init
npm init -y

# create env file e lo aggiungo al .gitignore
ni .env

# aggiungo nel file .env : 

PORT=3000 # La porta del mio server
DB_HOST=localhost # L'host del mio db sql
DB_USER=root # L'utente principale che accede al mio db sql
DB_PASSWORD=root # La password del mio db sql
DB_NAME=books_db # Il nome del mio db sql

# configuro nel package.json il dev e lo start nello script (env e watch [ --env-file=.env --watch ])
```

```json
"scripts": {
    //"start": "node --env-file=.env server.js",
    "dev": "node --env-file=.env --watch server.js"
  }
```

```bash
# installo express per similare un server
npm install express
```

```bash
    # Installo cors per eliminare le restrizioni sul frontend dal backend e dare le autorizzazioni a chi puo accedervi
    npm install cors
```

```bash
    # Installo mysql per accedere ed utilizzare il mio db
    npm install mysql2
```

```javascript
// Importo express nel server.js
const express = require("express");

// Creo un istanza del server
const server = express();

// Setto in una costante la porta per accedere al mio server
const PORT = process.env.PORT || 3000;


// Middleware per CORS//Uso cors per autorizzare l'accesso al mio server a tutti sulla rete non passando parametri nelle ()
server.use(cors());
//Nel caso volessi dare autorizzazione solo ad una porta specifica potrei inserire ad esempio:
const cors = require("cors"); 👈
server.use(cors({
  origin: 'localhost: http://localhost:5173' 👈
}));


//Other imports

//Definisco un asset statico e creo una directory pubblica nella root directory mkdir (cartella principale) pubblica
server.use(express.static("public"));

// Permette di leggere dati JSON e convertirli in oggetti JavaScript cosi da poter essere recuperati dal req.body
server.use(express.json());


//Aggiungo la rotta principale
server.get("/", (req, res) => {
  res.send("Home Page");
});

//other routes


//Metto in ascolto il server sul pio host e sulla mia porta
server.listen(port,  () => {
    console.log(`Server is running on http://localhost:${port}}`);
});

```

```bash
# launch server to test
npm run dev

```

```bash
# Creo le varie cartelle che userò
mkdir routes
mkdir controllers

mkdir middlewares
mkdir classes
mkdir models

# create models data
 cd models
 ni examples.js

# Creo il mio controller nella cartella controllers in cui andro a definire le varie chiamate al server (index, show, store, update, modify e destroy)
cd controllers
ni exampleController.js
```

## Step 2 - Connection, Controller and Routing

- Connection

```javascript
//Creiamo un file 
db_connection.js 

//Al suo interno andiamo a definire la connessione con il nostro db
import mysql from "mysql2"

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL Database!")
})

export default connection;

```

- Routes

```bash
 # Creo un file per le mie rotte .js
nome_router.js
```

```javascript
//in routes/nome_router.js

// importo express
const express = require('express')

//Creo un istanza per il router in  una costante
const router = express.Router()

//Importo le funzioni presenti nel controller(definite piu avanti)
const {
  index,
  show,
  store,
  update,
  destroy,
} = require('../controllers/nome_Controller.js')

//Rotte

// Index - Read all
//Metodo GET = INDEX
router.get('/', index)

// Show - Read one
//Metodo GET + ID = SHOW
router.get('/:id', show)

//Store - Create
//Metodo POST = STORE
router.post('/', store)

//Update - Update totale
//Metodo PUT + ID = UPDATE
router.put('/:id', update)

// Modify - Update (partial)
// router.patch("/:id", (req, res) => {
//   res.send("Modifica parziale item con id: " + req.params.id);
// });

// Destroy - Delete
//Metodo DELETE = DESTROY
router.delete('/:id', destroy)

//esport router
module.exports = router
```

```javascript
// in server.js

//Importo il router
const router = require('./routes/nome_router.js')

// aggiungo il middelware del router e la sua rotta
server.use('/nome', router)

```

- Controller

```javascript
// importo la connessione al db
import connection from "../db_connection.js"

//Ora definiamo le varie funzioni di chiamata al nostro server con relative Query



//INDEX
function index(req, res) {
    //Salvo la Query nella const sql
    //QUERY - Seleziomo tutti gli elementi dalla tabella nel db
    const sql = ("SELECT * FROM nome_tabella")

    connection.query(sql, (err, results) => {
        //se si presenta un errore nella connessione setto uno status di errore 500 e restituisco un json con un messaggio di errore
        if (err) return res.status(500).json({
            error: "Database query failed!"
        })
        //se la connessione va a buon fine stampo in console il risultato e restituisco un json con il numero di elementi e la lista dei vari elementi
        console.log(results);
        res.json({
            lenght: results.length,
            items: results
        });
    })
}

//SHOW
const show = (req, res) => {
    //Recupero l'id dell'elemento da trovare dal parametro nella URL
    const id = parseInt(req.params.id)
    //Salvo la Query nella const sql
    //QUERY - Seleziona l'elemento corrispondente all'id dalla tabella nel db
    const sql = `SELECT * FROM nome_tabella WHERE id = ?`
    connection.query(sql, [id], (err, results) => {
        //se si presenta un errore nella connessione setto uno status di errore 500 e restituisco un json con un messaggio di errore
        if (err)
            return res.status(500).json({
            error: "Database query failed!"
        })
        //Se nell'arrey del risultato all'indice 0 (il primo) non ci sono elementi setto uno status di errore 404 e restituisco un json con un messaggio di errore
        if (!results[0])
            return res.status(404).json({ error: "Element not found" })

            //Se la connessione va a buon fine e l'elemento viene trovato restituisco un json dell'elemento 
            return res.json(results)
     })
}

//STORE
function store(req, res) {
  let newId = 0
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].id > newId) {
      newId = menu[i].id
    }
  }
  newId += 1

  // new data is in req.body
  const newItem = {
    id: newId,
    title: req.body.title,
  }

  examples.push(newItem)
  res.status(201).json(newItem)
}

function update(req, res) {
  const id = parseInt(req.params.id)
  const item = exmples.find((item) => item.id === id)
  if (!item) {
    res.status(404).json({ success: false, message: 'Item non esiste' })
    return
  }

  //console.log(req.body);
  for (key in item) {
    if (key !== 'id') {
      item[key] = req.body[key]
    }
  }

  //console.log(examples);
  res.json(item)
}

//DESTROY
function destroy(req, res) {
    //Recupero l'id dell'elemento da eliminare dal parametro nella URL
    const id = parseInt(req.params.id)
    //Salvo la Query nella const sql
    //QUERY - Elimino l'elemento corrispondente all'id dalla tabella nel db
    const sql = ("DELETE FROM nome_tabella WHERE id = ?")
    connection.query(sql, [id], (err) => {
        //se si presenta un errore nella connessione setto uno status di errore 500 e restituisco un json con un messaggio di errore
        if (err) return (
            res.status(500),
            console.log("Movie is not found!")
        )
        return (
            res.status(204),
            console.log(`Movie (id:${id}) is removed!`)
        )
    })
}

// esporto le funzioni
module.exports = { index, show, store, update, destroy }
```

## Step 3 - Other Middlewares

```bash
 # create other middlewares at least error middleware
 cd middleware
 ni errorsHandler.js
 ni notFound.js
```

```javascript
// errors handler example

function errorsHandler(err, req, res, next) {
  console.error(err.stack.split('\n')[1])
  //console.log(err);
  res.status(err.statusCode || 500)
  res.json({
    error: err.message,
  })
}

module.exports = errorsHandler

// 404 not found example
function notFound(req, res, next) {
  res.status(404)
  res.json({ error: 'Not Found', message: 'Risorsa non trovata' })
}

module.exports = notFound
```

```javascript
// import in server.js
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

// register middleware as last routes in server.js

server.use(errorsHandler)

server.use(notFound)
```

## Step 4 - custom error

```bash
 # create custom error class extending Error class
 cd classes
 ni CustomError.js

```

```javascript
// custom error class

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = CustomError
```

```javascript
//import class where you need it (example in controller)
const CustomError = require('../classes/CustomError')

// use
throw new CustomError('Questo item non esiste', 404)
```
