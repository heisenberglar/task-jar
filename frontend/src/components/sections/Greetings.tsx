const Greetings: React.FC<{hidden: Boolean, userName: string}> = ({hidden, userName}) => {
    return (
        <div className={hidden? "hidden" : "greetings" }>
            <span className="greetings__main">Hi, {userName.split(" ", 1)}</span>
            <span className="greetings__subtitle">Ready to do some work?</span> 
        </div>
    )
}

export default Greetings
