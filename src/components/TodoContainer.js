import Todo from "./Todo";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Login from "./Login";

function TodoContainer({ username }) {
    const [name, setName]               = useState(username);
    const [tasks, setTasks]             = useState([]);
    const [newTask, setNewTask]         = useState([]);
    const [initialized, setInitialized] = useState(false);
    const url                           = "https://ToDo.mousamsaikia.repl.co/";//http://localhost:8080/
    const onAddBtnClick                 = () => { setNewTask(newTask.concat(<Todo url = { url } user = { name } />)) };
    const enforceGetTodos = useCallback(async () => { 
        await axios.post(url, { "name": name, "item_request": null })
    }, [name])
    const getTodos = useCallback(async () => {
        await axios.get(url + name).then((response) => {
            setTasks(response.data.items
                    .sort((a, b) => parseFloat(b.id) - parseFloat(a.id))
                    .map((element) => <Todo element = { element } url = { url } user = { name } />))
        }).catch(async () => { await enforceGetTodos().then(async () => { await getTodos() }) })
    }, [name, enforceGetTodos])

    const handleLogout = (event) => {
        localStorage.clear();
        setName(null);
    }

    useEffect(() => {
        localStorage.setItem('username', JSON.stringify(name));
        if(!initialized) {
            getTodos().then(() => { setInitialized(true) })
        }
    }, [initialized, name, getTodos])

    return name !== null ? (
    <>
    <h1 className="cursor-default select-none font-mono text-4xl mt-5">Your Tasks</h1>
    <button className="font-mono text-gray-300 ease-in-out transition-colors duration-700
                       cursor-default select-none hover:text-black" onClick={ handleLogout }>logout</button>
    { initialized ?
    (<div className="flex justify-center items-center">
        <div className="grid gap-10 m-auto place-items-center mt-10
                            justify-center items-center lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            <div className="flex flex-col items-center justify-center w-40 h-[187px]">
                <button onClick={ onAddBtnClick } className="bg-clip-text text-9xl ease-in-out
                                                                    transition-all duration-700 text-transparent h-fit w-fit
                                                                    cursor-default select-none bg-blue-400 hover:bg-purple-600">
                    +
                </button>
            </div>
            { newTask }
            { tasks }
        </div>
    </div>) : (
        <div role="status" className="mt-20">
            <svg aria-hidden="true" className="inline w-28 h-28 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
    }
    </>) : <Login />
}
export default TodoContainer;