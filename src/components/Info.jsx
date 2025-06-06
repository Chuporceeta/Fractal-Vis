'use client'
import React, {useState} from "react";
import {iInfo} from "@/components/icons";

export const Info = ({info}) => {
    const [show, setShow] = useState(false);
    const [clicked, setClicked] = useState(false);

    const text = {
        iterFunc:
`The complex function that is repeatedly iterated on z.
Please enter an expression in z composed only of the following functions:
cos, sin, cosh, sinh, exp, log, abs, pow, mul, div.`,
        constant:
`The constant term of the iterated function.
Please enter either a complex number in the
form a+bi or an expression of the form a*cis(t).
Alternatively, click on the cursor icon to control
the value using the mouse cursor. Clicking on
the canvas will fix the value to that position.`,
    }[info];

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => {setShow(true); setClicked(false);}}
            onMouseLeave={() => setShow(false)}
            onFocus={() => {setShow(true); setClicked(false);}}
            onBlur={() => setShow(false)}
            onClick={() => {setClicked(!clicked)}}
        >
            {iInfo}
            {(show || clicked) && (
                <div
                    className={`absolute z-10 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow transition-opacity duration-200 whitespace-pre top-3/4 left-full ml-1`}
                >
                    {text}
                </div>
            )}
        </div>
    );
}