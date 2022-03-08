import React, { useEffect, useState, useRef } from 'react';
import {Link} from 'react-router-dom'

const SideBar: React.FC<{hidden: Boolean, setUserName: React.Dispatch<React.SetStateAction<string>>, userName: string}> = ({hidden, setUserName, userName}) => {
    const [edit, setEdit] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
      }, [edit]);

    return (
        <div className={hidden? "hidden":"sidebar"}>
            <div className="sidebar__profile">
                {edit? 
                    <form 
                    className="sidebar__profile-name"
                    onSubmit={() => {
                        setUserName(inputRef.current!.value)
                        setEdit(false)
                    }}>
                    <input 
                        type="text" 
                        ref={inputRef} 
                        defaultValue={userName}
                        onBlur={() => setEdit(false)}
                    /> 
                    </form> : 
                    <span 
                    className="sidebar__profile-name" 
                    onDoubleClick={() => setEdit(true)}
                    >
                        {userName}
                    </span>
                }
            </div>
            <div className="sidebar__navigation"> 
                <span className="sidebar__navigation-title">Menu</span>
                <ul className="sidebar__navigation-list">
                <li><Link to="/tasks" >My tasks</Link></li>
                <li><Link to="/projects" >Projects</Link></li>
                <li><Link to="/settings" >Settings</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar
