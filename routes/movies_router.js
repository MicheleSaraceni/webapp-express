import express from "express"

import { index, show, destroy } from "../controllers/movies_controller.js"

const movies_router = express.Router();

movies_router.get("/", index)

movies_router.get("/:id", show)

//movies_router.post("/", store)

//movies_router.put("/:id", update)

//movies_router.patch("/:id", modify)

movies_router.delete("/:id", destroy)

export default movies_router;