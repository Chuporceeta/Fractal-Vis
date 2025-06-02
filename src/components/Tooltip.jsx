'use client'
import React, {useState} from "react";

export const Tooltip = ({info}) => {
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 fill-blue-500">
                <path fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"/>
            </svg>
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