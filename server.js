//importo express
import express from "express"
import movies_router from "./routes/movies_router.js"
//importo cors
import cors from "cors"


//creo istanza express
const server = express()

//importo dal file env la porta e la salvo nella const PORT
const PORT = process.env.PORT || 3000

//middelware express e cors
server.use(express.static("public"))
server.use(cors())
server.use(express.json())

//rotta principale
server.use("/movies", movies_router)

//rotte non definite
server.get("*", (req, res) => {
    res.status(404).send("Page Not Found")
})

//metto in ascolto il server alla mia PORT
server.listen(PORT, () => {
    console.log(`Il server è in ascolto su http://localhost:${PORT}`)
})