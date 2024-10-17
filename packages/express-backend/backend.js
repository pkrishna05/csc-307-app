// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    userService.getUsers(name, job).then((val) => {
        const result = { users_list: val };
        res.send(result);
    })
});
  
app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService.findUserById(id).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(404).send("Resource not found.");
    });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userService.addUser(userToAdd).then((val) => {
        res.status(201).send(val);
    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({error: err.message});
    });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService.findUserById(id.toString()).then((result) => {
        userService.deleteUser(result._id).then((val) => {
            res.sendStatus(204);
        }).catch((error) => {
            res.status(500).send(error);
        })
    }).catch((error) => {
        res.status(404).send("Resource not found.");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});