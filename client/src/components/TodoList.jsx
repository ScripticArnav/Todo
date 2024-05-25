import React, { useState } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreate = () => {
    setCurrentTask(null);
    setIsEditing(true);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleFormSubmit = async (task) => {
    try {
      if (task.id) {
        await axios.put(`http://localhost:3000/tasks/${task.id}`, task);
      } else {
        await axios.post("http://localhost:3000/tasks", task);
      }
      fetchTasks();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3000/tasks/${searchId}`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error("Error searching task:", error);
      setSearchResult(null);
    }
  };

  return (
    <div>
      <h1>todo List</h1>
      <button onClick={handleCreate}>Create New todo</button>
      <form onSubmit={handleSearch}>
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Task ID"
        />
        <button type="submit">Search</button>
      </form>
      {searchResult && (
        <div>
          <h2>Search Result</h2>
          <p>Title: {searchResult.title}</p>
          <p>Description: {searchResult.description}</p>
          <p>Status: {searchResult.status}</p>
          <p>DueDate: {searchResult.dueDate}</p>
        </div>
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span> -<span>{task.status}</span> -
            <span>{task.dueDate}</span>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {isEditing && <TodoForm task={currentTask} onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default TodoList;
