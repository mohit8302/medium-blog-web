import { Avatar } from "./BlogCard"

export const AppBar=()=>{
   return(
    <div className="border-b flex justify-between px-20 py-4 ">
        <div className="font-semibold ">
            Medium
        </div>
        <div >
            <Avatar name="Mohit Sain" size={"big"}/>
        </div>
    </div>
   )
}