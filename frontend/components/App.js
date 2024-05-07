import React from 'react'
import axios from 'axios'
import Form from './Form'
import Todo from './Todo'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleted: true,
  }
  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({...this.state, todos: res.data.data})
      })
      .catch(err => {
        this.setState({...this.state, error: err.response.data.message})
      })
  }
  onChange = evt => {
    const {value} = evt.target
    this.setState({...this.state, todoNameInput: value})
  }
  resetForm= () => {
    this.setState({...this.state, todoNameInput: ''})
  }
  componentDidMount(){
    this.fetchAllTodos()
  }
  postNewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
      .then(res => {
        this.setState({...this.state, todos: this.state.todos.concat(res.data.data)})
        this.resetForm()
      })
      .catch(err => {
        this.setState({...this.state, error: err.response.data.message})
      })
  }
  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({...this.state, todos: this.state.todos.map(td =>{
          if (td.id !== id) return td
          return res.data.data
        })})
      })
      .catch(err => {
        this.setState({...this.state, error: err.response.data.message})
      })
  }
  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
    this.setState({...this.state, todoNameInput: ''})
  }
  toggleDisplayCompleted= () =>{
    this.setState({...this.state, displayCompleted: !this.state.displayCompleted})
  }
  render() {
    return (
      <div>
        <div>
          <div id="error">Error: {this.state.error}</div>
          <TodoList
          todos={this.state.todos}
          displayCompleted={this.state.displayCompleted}
          toggleCompleted={this.toggleCompleted}
          />
        </div>
        <Form 
        onTodoFormSubmit={this.onTodoFormSubmit}
        onChange={this.onChange}
        toggleDisplayCompleted={this.toggleDisplayCompleted}
        todoNameInput={this.state.todoNameInput}
        displayCompleted={this.state.displayCompleted}

        />
      </div>


    )
  }
}
