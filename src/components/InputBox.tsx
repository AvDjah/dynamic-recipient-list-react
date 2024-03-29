import { Data, User } from "@/app/data";
import UserPill from "./UserPill";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import ListItem from "./ListItem";



export default function InputBox() {

    // User Related State
    const [users, setUsers] = useState<User[]>([])
    const [matchingUsers, setMatchingUsers] = useState<User[]>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [backspaceActive, setBackspaceActive] = useState(false)
    const [selectedIndex,setSelectedIndex] = useState(0)

    // Input State
    const [searchValue, setSearchValue] = useState("")
    const [isInputInFocus, setIsInputInFocus] = useState(false);

    // Refs
    const inputRef = useRef<HTMLInputElement | null>(null)
    const dummyRef = useRef<HTMLInputElement | null>(null)
    const usersRef = useRef<HTMLInputElement | null>(null)

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


    const HandleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && searchValue === '') {
            let elements = usersRef.current?.getElementsByClassName("pill")
            if (elements?.length !== 0) {
                let classes = elements?.item(elements.length - 1)?.classList
                if (classes?.contains("border-2")) {
                    RemoveUser(selectedUsers[selectedUsers.length - 1])
                    setBackspaceActive(false)
                } else {
                    elements?.item(elements.length - 1)?.classList.add("border-2")
                    setBackspaceActive(true)
                }
            }
        } else if(event.key === "ArrowDown" || event.key == "ArrowUp"){
            {
                console.log("Trigger")
                let n = matchingUsers.length
                if(event.key == "ArrowUp"){

                    if(selectedIndex !== -1){
                        setSelectedIndex(selectedIndex - 1)  
                    }
                } else {
                    if(selectedIndex <( n - 1)){
                        setSelectedIndex(selectedIndex + 1)
                    }
                }
            }
        } else if(event.key === "Enter"){
            if(selectedIndex !== -1){
                AddUser(0,matchingUsers[selectedIndex])
                setSelectedIndex(-1)
            }
        }
    }

    const RemoveBackspaceActivation = () => {
        let elements = usersRef.current?.getElementsByClassName("pill")
        if (elements?.length !== 0) {
            let classes = elements?.item(elements.length - 1)?.classList
            elements?.item(elements.length - 1)?.classList.remove("border-2")
            setBackspaceActive(false)
        }
    }

    const OnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let prefix: string;
        if (e.currentTarget.value === "") {
            prefix = "";
            setMatchingUsers(users);
        } else prefix = e.currentTarget.value.toLowerCase();

        const matchingElements = _.filter(users, user => _.startsWith(user.full_name.toLowerCase(), prefix));

        if(e.currentTarget.value !== "" && backspaceActive === true){
            RemoveBackspaceActivation()
        }

        // State Controls
        setSearchValue(e.currentTarget.value)
        setMatchingUsers(matchingElements)
    }


    const AddUser = (id: number, user: User) => {

        RemoveBackspaceActivation()

        // Check all users remaining after selection
        const filtered = _.filter(users, function (u) { return user.id !== u.id })

        // State Controls
        setSelectedUsers([...selectedUsers, user])
        setUsers(filtered)
        setMatchingUsers(filtered);
        setSearchValue("")

        // Focus Back on Input
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    }

    const RemoveUser = (user: User) => {

        RemoveBackspaceActivation()

        // Filter Remaining Users
        const filtered = _.filter(selectedUsers, function (u) {

            return user.id !== u.id
        })

        // State Controls
        setUsers([...users, user])
        setMatchingUsers([...users, user])
        setSelectedUsers(filtered)

        // Focus Back on Input
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    }




    return <div className="m-2 p-2 mx-auto rounded-md border-2 mt-4" >
        <div className='flex flex-row items-center flex-wrap  px-4 scrollbar-thin scrollbar-thumb-blue-500 ' >
            <div className="flex flex-row flex-wrap" ref={usersRef} >
                {selectedUsers.map((el, index) => {
                    return <UserPill key={index} user={el} RemoveUser={RemoveUser} />
                })}
                <div className="relative">
                    <input onKeyDown={HandleKeyPress} ref={inputRef} className="p-3 border-b-2 border-blue-700 text-black text-xl w-36 outline-none grow rounded-md " onChange={OnInputChange} value={searchValue} ></input>

                    <div className='bg-white shadow-xl rounded-md absolute top-14 left-0 w-72 md:w-96' hidden={!isInputInFocus} >
                        {/* <div className="bg-blue-100 p-2" >Results</div>
                        <div className="bg-white p-2" >
                            {matchingUsers.map((el, index) => {
                                return <div className={"flex flex-col md:flex-row justify-between p-2 hover:bg-blue-100 cursor-pointer "} key={index}
                                    onClick={() => AddUser(el.id, el)}
                                >
                                    <div className='flex flex-row items-center' > <img className='w-8 h-8 rounded-full mx-2' src={el.avatar} ></img> {el.full_name}</div>
                                    <div className='text-gray-500' >{el.email}</div>
                                </div>
                            })}
                        </div> */}
                        <ListItem selectedUser={selectedIndex} setSelectedUser={setSelectedIndex}  AddUser={AddUser} matchingUsers={matchingUsers} />
                    </div>
                </div>
            </div>
        </div>
        <input hidden ref={dummyRef} ></input>
    </div>
}