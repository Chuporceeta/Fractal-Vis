import React, {useContext, useState} from "react";
import {UserContext} from "@/components/userContext";

export const Header = ({children}) => {
    return <h2 className="text-xl font-semibold border-b pb-2">{children}</h2>;
}
export const CheckboxInput = ({children, value, onChange, name}) => {
    return (
        <label className="flex items-center justify-between">
            <div className="select-none"> {children} </div>
            <input
                id="checkbox"
                type="checkbox"
                name={name}
                value={value}
                onChange={onChange}
                checked={value === "true"}
            />
        </label>
    );
};

export const NumInput = ({children, value, onChange, min, max}) => {
    return (
        <label className="flex flex-col">
            <div className="text-sm font-medium mb-1">{children}</div>
            <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </label>
    );
};
