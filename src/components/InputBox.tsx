import { Data, User } from "@/app/data";
import UserPill from "./UserPill";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";



export default function InputBox() {

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

    // useEffect(() => {
    //     if (scrollRef.current) {
    //         scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    //     }
    // })

    const OnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (scrollRef.current) {
        //     scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        // }


        let prefix: string;
        if (e.currentTarget.value === "") {
            prefix = "";
            setMatchingUsers(users);
        } else prefix = e.currentTarget.value.toLowerCase();

        const matchingElements = _.filter(users, user => _.startsWith(user.full_name.toLowerCase(), prefix));

        // State Controls
        setSearchValue(e.currentTarget.value)
        setMatchingUsers(matchingElements)
    }


    const AddUser = (id: number, user: User) => {

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
        <div ref={scrollRef} className='flex flex-row items-center flex-wrap  px-4 scrollbar-thin scrollbar-thumb-blue-500 ' >
            <div className="flex flex-row flex-wrap" >
                {selectedUsers.map((el, index) => {
                    return <UserPill key={index} user={el} RemoveUser={RemoveUser} />
                })}
                <div className="relative">
                    <input ref={inputRef} className="p-3 border-b-2 border-blue-700 text-black text-xl w-36 outline-none grow rounded-md " onChange={OnInputChange} value={searchValue} ></input>

                    <div className='bg-white shadow-xl rounded-md absolute top-14 left-0 w-96'  hidden={!isInputInFocus} >
                        <div className="bg-blue-100 p-2" >Results</div>
                        <div className="bg-white p-2" >
                            {matchingUsers.map((el, index) => {
                                return <div className="flex flex-col md:flex-row justify-between p-2 hover:bg-blue-100 cursor-pointer " key={index}
                                    onClick={() => AddUser(el.id, el)}
                                >
                                    <div className='flex flex-row items-center' > <img className='w-8 h-8 rounded-full mx-2' src={el.avatar} ></img> {el.full_name}</div>
                                    <div className='text-gray-500' >{el.email}</div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <input hidden ref={dummyRef} ></input>
    </div>
}