import express from "express";
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

let tasks = [];
let currentId = 1;

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((item) => item.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found");
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = { id: currentId++, title, description, status, dueDate };
  tasks.push(task);
  res.status(202).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((item) => item.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found");

  const { title, description, status, dueDate } = req.body;

  task.title = title;
  task.description = description;
  task.status = status;
  task.dueDate = dueDate;

  res.status(202).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).send("Task not found");

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
