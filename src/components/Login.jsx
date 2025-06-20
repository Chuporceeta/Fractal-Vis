'use client'
import {getCurrentUser, handleLogin, logOut} from "@/app/db";
import {useEffect, useState} from "react";

export default function Login({onCancel, onLogin, submitText="Login"}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const handleCancel = () => {
        setUsername('');
        setPassword('');
        onCancel();
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setCurrentUser(user);
        });
    }, []);

    const buttons = (
        <div className="flex justify-between mb-2">
            <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-lg"
                onClick={handleCancel}
            >
                Cancel
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg"
                onClick={() => {
                    if (currentUser !== null) {
                        onLogin();
                    } else {
                        handleLogin(username, password).then(result => {
                            if (result.success) {
                                setCurrentUser(username);
                                onLogin();
                            } else {
                                setError(result.msg);
                            }
                        });
                    }
                }}
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
                        setCurrentUser(null);
                        logOut();
                    }}>Logout</button>
                </div>
                {buttons}
            </div>
        );
    }

    return (
        <div>
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