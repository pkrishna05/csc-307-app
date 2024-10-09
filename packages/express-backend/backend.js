// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

let users = {
    users_list: [
    {
    id: "xyz789",
    name: "Charlie",
    job: "Janitor"
    },
    {
    id: "abc123",
    name: "Mac",
    job: "Bouncer"
    },
    {
    id: "ppp222",
    name: "Mac",
    job: "Professor"
    },
    {
    id: "yat999",
    name: "Dee",
    job: "Aspring actress"
    },
    {
    id: "zap555",
    name: "Dennis",
    job: "Bartender"
    }
]
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name, job) => {
    return users["users_list"].filter(
        (user) => (user["name"] === name && user["job"] === job)
    );
};

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined) {
        let result = findUserByName(name, job);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);
  
app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
});

const addUser = (user) => {
    const id = Math.floor(Math.random() * 10000)
    user['id'] = `${id}`;
    users["users_list"].push(user);
    return user;
};
  
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    const user = addUser(userToAdd);
    res.send(201, user);
});

const deleteUser = (user) => {
    return users["users_list"].filter(obj => obj.id !== user);
};
  
app.delete("/users/:id", (req, res) => {

    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id.toString());
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
        users["users_list"] = deleteUser(id);
        res.send(204);
    }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});