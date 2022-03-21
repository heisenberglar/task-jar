import { useState } from 'react';
import {Task, Collection} from '../../types/types'
import {idGenerator} from '../../lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'

const Finder: React.FC<{
    hidden: Boolean, 
    setHidden: React.Dispatch<React.SetStateAction<Boolean>>,
    collections: Collection[]
}> = ({hidden, setHidden, collections}) => {
    const [foundTask, setFoundTask] = useState<Task>({name:'', id: idGenerator()})
    const [foundCollection, setFoundCollection] = useState<string>('')
    const [firstLoad, setFirstLoad] = useState<boolean>(true);

    const fetchTask = () => {
        const nonEmptyCollections = collections.filter(collection => collection.tasks.length > 0)
        const randomCollection = Math.floor((Math.random() * nonEmptyCollections.length));
        const randomTask = Math.floor((Math.random() * nonEmptyCollections[randomCollection].tasks.length));  
        setFoundTask(nonEmptyCollections[randomCollection].tasks[randomTask]) 
        setFoundCollection(nonEmptyCollections[randomCollection].name)
        setHidden(true)
        setFirstLoad(false)
      } 

    return (
        <div className={hidden? `${firstLoad? "finder__first-load": "finder__full-page"}` : "finder"}>
            <h1 className="finder__name">
                {
                    firstLoad ? "Lost, overwhelmed, or just... bored?" : foundTask.name
                } 
            </h1> 
            <span className="finder__collection">{foundCollection}</span>
            <button className="finder__search-button" onClick={fetchTask}>
                Find a task
            </button>
            <FontAwesomeIcon 
                icon={faSliders} 
                className={hidden? "finder__full-page-close-icon" : "hidden"}
                onClick = {() => setHidden(false)}
            />
        </div>
    )
}

export default Finder
