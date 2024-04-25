import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@mohit8302/medium-common"
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data;
            console.log(jwt)
            if (type === "signup") {
                localStorage.setItem("token", jwt);
            }
            else if (type === "signin") {
                localStorage.setItem("token", jwt.jwt);
            }

            navigate("/blogs");
        } catch (e) {
            console.log(e);
            alert("Error while signing up")
            // alert the user here that the request failed
        }
    }



    return (

        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center ">
                <div>
                    <div className="px-10 max-w-lg">
                        <div className="font-bold text-3xl">
                            {type === "signup" ? "Create an acccount" : "Sign in"}
                        </div>
                        <div className=" font-semibold text-slate-400 text-sm">
                            {type === "signup" ? "Already have an account?" : "Don't have an account?"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"} </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {type === "signup" ? <LabelledInput label="Username" placeholder="Enter Your name.." onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                name: e.target.value
                            })
                        }} /> : null}
                        <LabelledInput label="Email" placeholder="abc@123gmail.com" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                username: e.target.value
                            })
                        }} />
                        <LabelledInput label="Password" type="password" placeholder="123456" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            })
                        }} />
                        <button onClick={sendRequest} type="button" className="w-full mt-8     text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Signup" : "Signin"}</button>
                    </div>


                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm font-bold text-black">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
        </div>
    )

}