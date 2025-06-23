'use client'
import {handleLogin, logOut} from "@/app/db";
import {useContext, useState} from "react";
import {UserContext} from "@/components/userContext";

export default function Login({onCancel=()=>{}, onLogin=()=>{}, onLogOut=()=>{}, submitText="Login", modal=false}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const handleCancel = () => {
        setUsername('');
        setPassword('');
        onCancel();
    };

    const [error, setError] = useState(null);

    function handleSubmit(){
        if (currentUser !== null) {
            onLogin();
        } else {
            handleLogin(username, password).then(result => {
                if (result.success) {
                    setCurrentUser(username);
                    setUsername('');
                    setPassword('');
                    onLogin();
                } else {
                    setError(result.msg);
                }
            });
        }
    }

    const buttons = (
        <div className="flex justify-between mb-2">
            <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-lg"
                onClick={handleCancel}
            >
                {modal ? "Cancel" : "Clear"}
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg"
                onClick={handleSubmit}
            >
                {submitText}
            </button>
        </div>
    );


    if (currentUser !== null) {
        return (
            <div>
                <div className="flex justify-between mb-4">
                    <span>Logged in as {currentUser}</span>
                    <button className="text-blue-600 hover:underline" onClick={()=> {
                        logOut().then(() => {
                            setCurrentUser(null);
                            onLogOut();
                        });
                    }}>Logout</button>
                </div>
                {modal ? buttons : null}
            </div>
        );
    }

    return (
        <div onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
            }
        }}>
            <div className="mb-3">
                <label className="block text-sm text-gray-600">Username</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm text-gray-600">Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                />
            </div>
            {buttons}
            {error !== null ? <span className="block text-sm text-red-500">{error}</span>: null}
            <span className="text-sm">*If you do not already have an account, one will be automatically created.</span>
        </div>
    );
}