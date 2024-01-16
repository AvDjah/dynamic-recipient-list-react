import { User } from "@/app/data"



export default function UserPill(props: { user: User, RemoveUser: (id: User) => void }) {
    const user = props.user
    return <div className='bg-gray-200 border-blue-700  mx-2 my-2 flex flex-row items-center rounded-2xl  w-48 cursor-pointer pill' >
        <img className='h-8 w-8 scale-125 rounded-full' src={user.avatar} />
        <div className='ml-2 flex flex-row justify-between w-2/3' >
            <div className='overflow-hidden text-nowrap'  >{user.full_name}</div>
            <div className=' scale-125' onClick={() => props.RemoveUser(user)}  >X</div>
        </div>
    </div>
}