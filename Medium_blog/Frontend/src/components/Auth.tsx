import { signupInput } from "kaustavchakraborty99-medium";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<signupInput>({
        name: "",
        email: "",
        password: ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const jwt = response.data;
            localStorage.setItem("token", jwt.jwt);
            console.log(jwt)
            navigate("/blogs");
        } catch (e) {
            console.error(e); // Log the error to get more details
            alert("Error while signing up");
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="text-3xl font-extrabold ">
                        {type === "signup" ? "Create An Account" : "Sign In"}
                    </div>
                    <div className="text-slate-400">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                    <div>
                        <LabeledInput
                            label="Name"
                            placeholder="Kaustav Chakraborty"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value
                                });
                            }}
                        />
                        <LabeledInput
                            label="Email"
                            placeholder="Kaustavchakraborty99@gmail.com"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    email: e.target.value
                                });
                            }}
                        />
                        <LabeledInput
                            label="Password"
                            type="password"
                            placeholder="123456"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    password: e.target.value
                                });
                            }}
                        />
                        <button
                            type="button"
                            onClick={sendRequest}
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InputLabeledProps {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabeledInput({ label, placeholder, onChange, type }: InputLabeledProps) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
