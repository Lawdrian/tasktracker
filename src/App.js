import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import  {useState, useEffect} from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom' 

function App() {
  const[showAddTask, setShowAddTask] = useState(false)
  const[tasks, setTasks] = useState( [
    //{text: 'Go fishing' , id: 1 , day: 'Feb 5th at 2:30pm,', reminder: true},
    //{text: 'Go Skiing' , id: 2, day: 'Feb 6th at 1:30pm,', reminder: true},
    //{text: 'Learn react' , id: 3, day: 'Feb 7th at 7:30p,', reminder: false}
  ])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //Fetch Tasks from JSON server
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    
    console.log(data)
    return data
  }

  //Fetch Task from JSON server
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    
    console.log(data)
    return data
  }

  // Add Task
  const addTask = async (task)  => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    
    const data = await res.json()

    setTasks([...tasks, data])
  //  const id = Math.floor(Math.random() * 10000) +1
  //  const newTask =  {id, ...task}
  //  setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
    
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    console.log(taskToToggle.reminder)
    const updTask = {...taskToToggle, 
      reminder: !taskToToggle.reminder} 

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask) 
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) => task.id === id ? {...task, reminder:
         data.reminder} : task
      )
    )
  } 

  return (
    <Router>
    <div className="constainer">
     <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd = {showAddTask} />
     
    <Route path='/' exact render={(props) => (
      <>
        { showAddTask && <AddTask onAdd=
        {addTask}/>}
        {tasks.length > 0 ? (
        <Tasks 
          tasks={tasks} 
          onDelete={deleteTask} 
          onToggle ={toggleReminder}  
        /> 
        ): ( 
          'No Tasks to show'
        )}
      </>

    )}/>
    <Route path='/about' component={About} />
    <Footer/>
    </div>
    </Router>
  );
}


export default App;
