import React, { useEffect, useState, useRef, useReducer } from 'react';
import {Task, Collection, Action} from '../../types/types'
import '../../pages/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus, faTrash } from '@fortawesome/free-solid-svg-icons'
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd'
import {idGenerator} from '../../lib/utils'
import TaskCollectionsHeader from './TaskCollectionsHeader'
import TaskInput from './TaskInput'
import {useQuery, gql} from '@apollo/client'

const TaskCollections: React.FC<{setAvailableCollections: React.Dispatch<React.SetStateAction<Collection[]>>, hidden: Boolean}> = ({setAvailableCollections, hidden}) => {
  const GET_STARTER_PROJECT = gql`
    query getProjectById($_id: ID!) {
      projectsById(_id: $_id) {
        collections {
          _id
          name
          tasks {
            _id
            name
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_STARTER_PROJECT, {
    variables: {
      _id: "62387a669408cdc2eee5680e"
    }
  });
  

  const localData = localStorage.getItem('collections')
  let starterCollections: Collection[] = [];


  if (localData) {
    starterCollections= JSON.parse(localData)
  } else {
    if (!loading && data) {
      starterCollections = data.projectsById.collections
    }
   
    //To be transferred to MongoDB
  
    // starterCollections =  data.projectsById.collections
    // if (data) {
    //   console.log(data)
    // }

    
    // console.log(starterCollections)
    // [
    //   {
    //     id: 0,
    //     name: '5 minutes',
    //     tasks: [
    //       {name: 'Full body stretch', id: idGenerator()},
    //       {name: 'Clean out your desk', id: idGenerator()},
    //       {name: 'Hydrate and get some fresh air', id: idGenerator()}
    //     ]
    //   },
    //   {
    //     id: 1,
    //     name: '15 minutes',
    //     tasks: [
    //       {name: 'Go for a walk', id: idGenerator()},
    //       {name: 'Journal', id: idGenerator()},
    //       {name: 'Work on your emails', id: idGenerator()}
    //     ]
    //   },
    //   {
    //     id: 2,
    //     name: '30 minutes',
    //     tasks: [
    //       {name: 'Take a power nap', id: idGenerator()},
    //       {name: 'Read a few chapters of a book', id: idGenerator()},
    //       {name: 'Meditate', id: idGenerator()}
    //     ]
    //   }
    // ]
  }

  const [collections, dispatch] = useReducer((state: Collection[], action: Action) => {
    switch (action.type) {
      case 'reorder':
        return state.map((collection) => {
          if (collection._id === action.collection) {
            return action.updatedCollection!
          }
        return collection;
      });
      case 'add':
        if (!action.name) {
          return state;
        }

        if (!state.some(collection => collection._id === action.collection)) {
         action.collection = state[0]._id
        } 

        const newTask: Task = {name: action.name, id: idGenerator()}
        return state.map((collection) => {
          if (collection._id === action.collection) {
            return {
              ...collection,
              tasks: [...collection.tasks, newTask]
            }
          }
        return collection;
        });
      case 'edit':
        if (!action.name) {
          return state;
        }
        return state.map((collection) => {
          if (collection._id === action.collection) {
            collection.tasks.map(task => {
              if (task._id === action.task) {
                task.name = action.name!
              } 
              return task
            })
          } return collection
        }
      );
      case 'delete':
        return state.map((collection) => {
          if (collection._id === action.collection) {
            return {
              ...collection,
              tasks: collection.tasks.filter(task => task._id !== action.task)
            }
          }
        return collection;
      });
      case 'addCollection':
        if (!action.name) {
          return state;
        }
        const newCollection: Collection = {name: action.name, id: idGenerator(), tasks: []}
        return [...state, newCollection];
      case 'jump':
        return state.map((collection) => {
          if (collection._id === action.updatedSource!._id) {
            return action.updatedSource!
          } 
          if (collection._id === action.updatedDestination!._id) {
            return action.updatedDestination!
          }
        return collection;
      });
      case 'deleteCollection':
        return state.filter(collection => collection._id !== action.collection);
      default:
        return state;
    }
  }, starterCollections);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent )  => {
    event.preventDefault()

    dispatch({
      type: 'add',
      name: inputRef.current!.value,
      collection: 0
    });

    inputRef.current!.value = '';
  }

  const onDragEnd = (result: DropResult) => {
    const {source, destination} = result;

    if (!destination) {
      return;
    }
    
    const sourceId = parseInt(source.droppableId);
    const destinationId = parseInt(destination.droppableId);

    if (sourceId === destinationId) {
      const changedCollection = collections.find((collection: Collection) => collection._id === destinationId)

      if (changedCollection) {
        const newCollectionTasks = [...changedCollection.tasks]
        const [removed] = newCollectionTasks.splice(source!.index, 1)
        newCollectionTasks.splice(destination!.index, 0, removed)
        changedCollection.tasks = newCollectionTasks

        dispatch({
          type: 'reorder',
          collection: changedCollection._id,
          updatedCollection: changedCollection
        })
      }
    } else {
      const sourceCollectionCopy = collections.find(collection => collection._id === sourceId)
      const destinationCollectionCopy = collections.find(collection => collection._id === destinationId)
      
      const jumper = sourceCollectionCopy!.tasks[source.index]
      sourceCollectionCopy!.tasks.splice(source.index, 1)
      destinationCollectionCopy!.tasks.splice(destination.index, 0, jumper)

      dispatch({
          type: 'jump',
          updatedSource: sourceCollectionCopy,
          updatedDestination: destinationCollectionCopy
      })
    }
  }

  useEffect(() => {
    setAvailableCollections(collections)
    const stringifiedCollections = JSON.stringify(collections)
    localStorage.setItem('collections', stringifiedCollections)
    // eslint-disable-next-line
  }, [collections])
  
  const [edit, setEdit] = useState<number>(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return ( 
    <div className={hidden? "hidden": "tasks tasks__board"}>
        <div className="tasks__collections">
          <DragDropContext onDragEnd={onDragEnd}>
            <TaskCollectionsHeader dispatch={dispatch}/>
              {collections.map((collection: Collection) => {
                return <Droppable droppableId={JSON.stringify(collection._id)} key={collection._id}>
                {(provided) => (  
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="tasks__collection"
                  >
                    <span>
                      <span>{collection.name}</span>
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        className="tasks__collection-delete-icon" 
                        onClick={() => dispatch({
                          type: 'deleteCollection',
                          collection: collection._id,
                        })}
                      />
                    </span>
                    {collection.tasks.map((task, index) => {
                      return <Draggable 
                        draggableId={task._id.toString()} 
                        key={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`tasks__collection-item ${snapshot.isDragging? 'dragActive': ''}`}
                          >
                            {edit === task._id? 
                              <form 
                                className="tasks__collection-item-form" 
                                onSubmit={() => {
                                  dispatch({
                                    type: 'edit',
                                    name: inputRef.current!.value,
                                    collection: collection._id,
                                    task: task._id
                                  })
                                  setEdit(0)
                                }}
                              >
                                <input 
                                  type="text" 
                                  className="tasks__collection-item-input" 
                                  ref={inputRef}
                                  defaultValue={task.name}
                                  onBlur={() => setEdit(0)}
                                />
                              </form>
                              : <span onDoubleClick={() => 
                                setEdit(task._id)
                              }>
                                {task.name}
                              </span>
                            }
                            
                            <FontAwesomeIcon 
                              icon={faCircleMinus} 
                              className="tasks__collection-item-delete-icon" 
                              onClick={() => dispatch({
                                type: 'delete',
                                collection: collection._id,
                                task: task._id
                              })}
                            />
                          </div>
                        )}
                      </Draggable>
                    })}
                    {provided.placeholder}  
                  </div>
                )}
              </Droppable>
            })}
          </DragDropContext>
        </div>
        <TaskInput handleSubmit={handleSubmit} inputRef={inputRef}/>
      </div>
    )
  }

  export default React.memo(TaskCollections)