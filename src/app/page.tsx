'use client'

import { LegacyRef, RefObject, useEffect, useRef, useState } from 'react'
import { Data, User } from './data'
import { faker } from '@faker-js/faker'
import _, { filter } from 'lodash'

function UserPill(props: { user: User, RemoveUser: (id: User) => void }) {
    const user = props.user
    return <div className='bg-gray-200 mx-2 flex flex-row items-center rounded-2xl  w-36 border-1 border-black cursor-pointer' >
        <img className='h-8 w-8 scale-125 rounded-full' src={user.avatar} />
        <div className='ml-2 flex flex-row justify-between w-2/3' >
            <div className='overflow-hidden text-nowrap'  >{user.full_name}</div>
            <div className=' scale-125 px-2' onClick={() => props.RemoveUser(user)}  >X</div>
        </div>
    </div>
}



function InputBox() {

    // User Related State
    const [users, setUsers] = useState<User[]>([])
    const [matchingUsers, setMatchingUsers] = useState<User[]>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])

    // Input State
    const [searchValue, setSearchValue] = useState("")
    const [isInputInFocus, setIsInputInFocus] = useState(false);

    // Refs
    const inputRef = useRef<HTMLInputElement | null>(null)
    const scrollRef = useRef<HTMLInputElement | null>(null)
    const dummyRef = useRef<HTMLInputElement | null>(null)


    useEffect(() => {
        setUsers(Data);
        setMatchingUsers(Data)


        const handleFocusChange = () => {
            setIsInputInFocus(document.activeElement === inputRef.current);
        };

        const handleBodyClick = (event: MouseEvent) => {
            
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                dummyRef.current?.focus()
                inputRef.current?.blur()
                setIsInputInFocus(false)
            } 
        };

        document.addEventListener('focusin', handleFocusChange);
        document.body.addEventListener('click', handleBodyClick);

        return () => {
            document.removeEventListener('focusin', handleFocusChange);
            document.body.removeEventListener('click', handleBodyClick);
        };
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    })

    const OnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }

        setSearchValue(e.currentTarget.value)

        let prefix: string;
        if (e.currentTarget.value === "") {
            prefix = "";
            setMatchingUsers(users);
        } else prefix = e.currentTarget.value.toLowerCase();

        const matchingElements = _.filter(users, user => _.startsWith(user.full_name.toLowerCase(), prefix));
        setMatchingUsers(matchingElements)
    }

    const HiddenDiv = () => {
        if (document.activeElement === inputRef.current) {
            return false;
        } else return true;
    }

    const AddUser = (id: number, user: User) => {
        setSelectedUsers([...selectedUsers, user])
        const filtered = _.filter(users, function (u) { return user.id !== u.id })
        setUsers(filtered)
        setMatchingUsers(filtered);
        setSearchValue("")
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    }

    const RemoveUser = (user: User) => {
        var userInAction: User | null = null;
        const filtered = _.filter(selectedUsers, function (u) {
            
            return user.id !== u.id
        })
        
        setUsers([...users,user])
        setMatchingUsers([...users,user])
        setSelectedUsers(filtered)
        console.log("Filtered:",filtered)
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    }


    return <div className="m-2 p-2 mx-auto rounded-md" >
        <div ref={scrollRef} className='flex flex-row items-center overflow-scroll px-4 scrollbar-thin scrollbar-thumb-blue-500 ' >
            <div className="flex flex-row" >
                {selectedUsers.map((el, index) => {
                    return <UserPill key={index} user={el} RemoveUser={RemoveUser} />
                })}
            </div>
            <input ref={inputRef} className="p-3  text-black text-xl outline-none w-full min-w-36 rounded-md " onChange={OnInputChange} value={searchValue} ></input>
        </div>
        <div className='bg-white shadow-xl rounded-md' hidden={!isInputInFocus} >
            <div className="bg-blue-100 p-2" >Results</div>
            <div className="bg-white p-2" >
                {matchingUsers.map((el, index) => {
                    return <div className="flex flex-row justify-between p-2 hover:bg-blue-100 cursor-pointer " key={index}
                        onClick={() => AddUser(el.id, el)}
                    >
                        <div className='flex flex-row items-center' > <img className='w-8 h-8 rounded-full mx-2' src={el.avatar} ></img> {el.full_name}</div>
                        <div className='text-gray-500' >{el.email}</div>
                    </div>
                })}
            </div>
        </div>
        <input hidden ref={dummyRef} ></input>
    </div>
}




export default function Home() {
    return (
        <div className="mx-auto border-2 border-blue-300 rounded-xl w-1/2 p-4 m-4 " >
            <InputBox></InputBox>
        </div>
    )
}