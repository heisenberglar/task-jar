const TaskInput: React.FC<{handleSubmit:(event: React.FormEvent) => void, inputRef: React.MutableRefObject<HTMLInputElement | null>}> = ({handleSubmit, inputRef}) => {
    return (
      <form 
        className="tasks__collection-item-form" 
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          className="tasks__collection-item-form-input" 
          ref={inputRef}
          placeholder="Add a new task"
        />
      </form>
    )
}

export default TaskInput
