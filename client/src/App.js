import React, { useEffect, useState } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = "http://localhost:3001"

function App() {

  const [todos, setTodos] = useState([])
  const [popupActive, setpopupActive] = useState(false)
  const [newTodo, setNewtodo] = useState("")

  const showToastMessage = () => {
    toast.error('Write Some Task!!!!!', {
        position: toast.POSITION.TOP_CENTER
    });
};

  useEffect(() => {
    getTodos()

  }, [])


  const completeTodo = async (id) => {
    const response = await axios.put(`${api}/todo/complete/${id}`)



    setTodos(todos => todos.map(todo => {
      if (todo._id === response.data._id) {
        todo.complete = response.data.complete;
      }

      return todo;
    }));

  }

  const deleteTodo = async (id) => {
    const response = await axios.delete(`${api}/todo/delete/${id}`)

    const newData = todos.filter(todo => {
      return todo._id !== response.data._id
    })

    setTodos(newData)
  }



  const getTodos = async () => {
    const response = await axios.get(`${api}/todos`)
    setTodos(response.data)
  }

  const addTodo = async() =>{
    if(newTodo !== ""){
    const response =  await axios.post(`${api}/todo/new`, {
      text : newTodo
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setTodos([...todos,response.data])
    setpopupActive(false)
    setNewtodo("")
  }
  else
  {
     
    setpopupActive(false)
    setNewtodo("")
    showToastMessage()
    
  }
  }

  return (
    <div className="app">
      <h1>Welcome Jayakrishnan</h1>
      <h4>Your Task's</h4>
      <div className='todos'>

        {
          todos.map(todo => (
            <div
              className={"todo " + (todo.complete ? "is-complete" : "")}
              key={todo._id} >
              <div className='check-box' onClick={() => completeTodo(todo._id)}></div>
              <div className='text'>{todo.text}</div>
              <div className='delete-todo' onClick={() => deleteTodo(todo._id)}>x</div>
            </div>
          ))
        }
      </div>
      <div className="addPopup" onClick={() => setpopupActive(true)}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setpopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input type="text" 
            className="add-todo-input" 
            onChange={e => setNewtodo(e.target.value)} 
            value={newTodo} />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}
       <ToastContainer />
    </div>
  );
}

export default App;
