import { User } from "@/app/data"
import { Dispatch, SetStateAction } from "react";





export default function ListItem(props: { matchingUsers: User[], AddUser: (id: number, user: User) => void, selectedUser : number, setSelectedUser : Dispatch<SetStateAction<number>> }) {

    const matchingUsers = props.matchingUsers;
    const AddUser = props.AddUser;
    const selectedUser = props.selectedUser;
    const setSelectedUser = props.setSelectedUser

    const handleMouseEnter = (index: number) => {
        setSelectedUser(index);
      };
    
      const handleMouseLeave = () => {
        setSelectedUser(-1);
      };

    return <>
        <div className="bg-blue-100 p-2" >Results</div>
        <div className="bg-white p-2" >
            {matchingUsers.map((el, index) => {
                return <div  onMouseEnter={() => handleMouseEnter(index)} className={"flex flex-col md:flex-row justify-between p-2  cursor-pointer " + (selectedUser === index ? " bg-blue-100 " : "")} key={index}
                    onClick={() => AddUser(el.id, el)}
                >
                    <div className='flex flex-row items-center' > <img className='w-8 h-8 rounded-full mx-2' src={el.avatar} ></img> {el.full_name}</div>
                    <div className='text-gray-500' >{el.email}</div>
                </div>
            })}
        </div>
    </>
}