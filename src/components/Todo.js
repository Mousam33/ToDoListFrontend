import { useState } from "react";
import axios from "axios";

function Todo({ element, url, user }) {
    const [task, setTask] = useState(element ? element.name : '');
    const [showComponent, setShowComponent] = useState(true);
    const [showSaved, setShowSaved] = useState(false);
    const handleTaskChange = (event) => { setTask(event.target.value) }
    const handleDelete = async () => {
        if(element) {
            await axios.delete(url, { data: {"name" : user, "item_request" : { "id" : parseInt(element.id) } } })
                       .then(() => { setShowComponent(false) })
        } else { setShowComponent(false) }
    }
    const handleSave   = async () => {
        if(task) {
            await axios.put(url, 
            {
                "name": user,
                "item_request": {
                    "id" : element ? parseInt(element.id) : -1,
                    "name": task,
                    "is_active": true
                }
            }).then(() => {
                setShowSaved(true);
                setTimeout(() => { setShowSaved(false) }, 1000);
              })
        }
    }
    return showComponent ? (
    <>
    <div className="grid grid-cols-2 w-40 item-center m-auto ring-2
                ease-in-out transition-all resize-none select-none
                ring-black rounded-xl hover:rounded-none">
        <textarea className="col-span-2 ring-2 ring-black h-40 w-full cursor-default
                            indent-1 font-mono text-sm" placeholder="Write a ToDo..."
                            value={ task } onChange={ handleTaskChange }/>
        <div>
            <button className="text-left bg-green-600 bg-clip-text w-full select-none
                            cursor-default hover:bg-green-300 ease-in-out transition-all
                            text-transparent font-mono" onClick={ handleSave } >SAVE</button>
        </div>
        <div>
            <button className="text-right bg-red-600 bg-clip-text w-full select-none
                            cursor-default hover:bg-red-300 ease-in-out transition-all
                            text-transparent font-mono" onClick={ handleDelete } >DELETE</button>
        </div>
        <div className={`font-mono h-0 col-span-2 text-green-600 ease-in-out
                    transition-opacity duration-500 ${showSaved ? 'opacity-100' : 'opacity-0'}`}>
            SAVED
        </div>
    </div>
    </>
    ) : null;
}
export default Todo;