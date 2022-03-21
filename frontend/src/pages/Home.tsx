import { useEffect, useState } from 'react';
import { Collection } from '../types/types'
import Sidebar from '../components/sections/SideBar'
import Finder from '../components/sections/Finder'
import Greetings from '../components/sections/Greetings'
import './styles.css'
import TaskCollections from '../components/sections/TaskCollections'

export default function Home() {
  const localUser = localStorage.getItem('user');
  let initialUserName: string= localUser? JSON.parse(localUser): "Stranger";

  const [userName, setUserName] = useState<string>(initialUserName);
  const [collections, setCollections] = useState<Collection []>([]);
  const [hidden, setHidden] = useState<Boolean>(true);

  useEffect(() => {
    const updatedUser = JSON.stringify(userName);
    localStorage.setItem('user', updatedUser);
  }, [userName]);

  return <div className="home"> 
    <Sidebar hidden={hidden} userName={userName} setUserName={setUserName}/>
    <Greetings hidden={hidden} userName={userName} />
    <Finder hidden={hidden} setHidden={setHidden} collections={collections}/>
    <TaskCollections setCollections={setCollections} hidden={hidden}/>
  </div>
} 