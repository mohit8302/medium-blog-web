import { Blog } from "../hooks";
import { AppBar } from "./Appbar";
import { Avatar } from "./BlogCard";
import PopupShow from "./PopupShow";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {  useLocation,useNavigate } from "react-router-dom";

export const FullBlog = ({ blog }: {blog: Blog}) => {
    const navigate=useNavigate();
    const location = useLocation();
    const postId = location.pathname.split('/').pop();
    return (
        <div>
            <AppBar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
                    <div className="col-span-8">
                        <div className="text-5xl font-extrabold">
                          {blog.title}
                     </div>
                     <div className="text-slate-500 pt-2">
                      Post on 2nd December 2023
                     </div>
                     <div className="pt-4">
                         {/* Render each paragraph of the content */}
                          {blog.content.split('\n').map((paragraph, index) => (
                           <p key={index}>{paragraph}</p>
                           ))}
                      </div>
                    </div>
                    <div className="col-span-4">
                        <div className="text-slate-600 text-lg">
                            Author
                        </div>
                        <div className="flex w-full">
                            <div className="pr-4 flex flex-col justify-center">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-xl font-bold">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-500">
                                    Random catch phrase about the author's ability to grab the user's attention
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
            <div className="flex space-between grid grid-cols-2  w-full ml-40 mt-15 pt-200 max-w-screen-xl pt-12 ">
                <div className="">
                    <button type="button" className="text-white bg-red-700 hover:bg-blue-800 focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >Edit</button>
                </div>
                <div className="">
                    <button onClick={async()=>{
                    
                   await axios.delete(
                    `${BACKEND_URL}/api/v1/blog/${postId}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    }
                );
                // Optionally, you can navigate to a different page after deletion
                navigate('/blogs');
                }}>
                   <PopupShow/>
                </button>
                </div>           
            </div>
        </div>
    );
}

export default FullBlog;
