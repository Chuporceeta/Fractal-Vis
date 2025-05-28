import React from "react";
import {Tooltip} from "@/app/components/Tooltip";

function handleFuncInput(func, updateState) {
    updateState("funcInput", func);

    func = func.replaceAll('cos', 'ccos')
               .replaceAll('sin', 'csin')
               .replaceAll('exp', 'cexp')
               .replaceAll('log', 'clog');

    console.log(func);
    updateState("iterFunc", func);
}

export const Sidebar = ({state, updateState}) => {
    return (
        <div className="w-64 h-full bg-white shadow-lg p-4 flex flex-col gap-6">
            <h2 className="text-xl font-semibold border-b pb-2">Parameters</h2>

            {/* Iterated Function */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium mb-1">Iterated Function</label>
                    <Tooltip info='iterFunc'/>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-math"> f(z) = </span>
                    <input
                        type="text"
                        value={state.funcInput}
                        onChange={(e) => handleFuncInput(e.target.value, updateState)}
                        className="font-math focus:outline-none max-w-30 border-b"
                    />
                    <span className="font-math"> {state.pixelToC ? "+ c" : "+ c(t)"} </span>
                </div>
            </div>

            {/* Max Iterations */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Max Iteration Number</label>
                <input
                    type="number"
                    value={state.maxIter}
                    onChange={(e) => updateState("maxIter", Number(e.target.value))}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Escape Radius */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Escape Radius</label>
                <input
                    type="number"
                    min={0}
                    value={state.rad}
                    onChange={(e) => updateState("rad", Number(e.target.value))}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Pixel Mapping */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Map Pixels To:</label>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-math italic">z </span> (Julia)
                    <button
                        onClick={() => {
                            updateState("pixelToC", !state.pixelToC);
                        }}
                        className={"w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out bg-blue-500"}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                                state.pixelToC ? "translate-x-6" : "translate-x-0"
                            }`}
                        />
                    </button>
                    <span className="text-lg font-math italic">c </span> (Mandelbrot)
                </div>
            </div>


            {/* Constant Term */}
            {state.pixelToC ? null :
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">"Constant" Term</label>
                    <div className="flex items-center gap-2">
                        <span className="font-math"> c(t) = </span>
                        <input
                            type="text"
                            value={state.cFunc}
                            onChange={(e) => updateState("cFunc", e.target.value)}
                            className="font-math focus:outline-none max-w-32"
                        />
                    </div>
                </div>
            }

            <h2 className="text-xl font-semibold border-b">Visuals</h2>
            {/* Flipping */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    Flip Horizontally
                    <input
                        type="checkbox"
                        value={state.xFlip}
                        onChange={() => updateState("xFlip", -state.xFlip)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    Flip Vertically
                    <input
                        type="checkbox"
                        value={state.yFlip}
                        onChange={() => updateState("yFlip", -state.yFlip)}
                    />
                </div>
            </div>

        </div>
    );
};
