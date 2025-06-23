'use client'
import {createContext, useEffect, useState} from "react";
import {getCurrentUser} from "@/app/db";

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => {},
});

export const UserContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setCurrentUser(user);
        });
    }, []);

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
            {children}
        </UserContext.Provider>
    );
};