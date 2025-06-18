import {Info} from "@/components/Info";
import {iCursorFilled, iCursorOutline} from "@/components/icons";
import {CheckboxInput, Header, NumInput} from "@/components/miniComponents";

function handleFuncInput(func, updateState) {
    updateState("funcInput", func);

    func = func.replaceAll('cos', 'ccos')
               .replaceAll('sin', 'csin')
               .replaceAll('exp', 'cexp')
               .replaceAll('log', 'clog');

    updateState("iterFunc", func);
}

export const Sidebar = ({state, updateState}) => {
    return (
        <div className="w-64 h-full bg-white shadow-lg p-4 flex flex-col gap-6">
            <Header>Parameters</Header>

            {/* Iterated Function */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium mb-1" htmlFor="iterFunc">Iterated Function</label>
                    <Info info='iterFunc'/>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-math"> f(z) = </span>
                    <input
                        id="iterFunc"
                        type="text"
                        value={state.funcInput}
                        onChange={(e) => handleFuncInput(e.target.value, updateState)}
                        className="font-math focus:outline-none max-w-30 border-b"
                    />
                    <span className="font-math"> {state.pixelToC ? "+ c" : "+ c(t)"} </span>
                </div>
            </div>

            {/* Max Iterations */}
            <NumInput value={state.maxIter} onChange={(e) => updateState("maxIter", Number(e.target.value))} min={1} max={10000}>
                Max Iteration Number
            </NumInput>

            {/* Escape Radius */}
            <NumInput value={state.rad} onChange={(e) => updateState("rad", Number(e.target.value))} min={0}>
                Escape Radius
            </NumInput>

            {/* Pixel Mapping */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Map Pixels To:</label>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-math italic">z </span> (Julia)
                    <button
                        onClick={() => updateState("pixelToC", !state.pixelToC)}
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
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium mb-1">"Constant" Term</label>
                        <Info info='constant'/>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-math"> c(t) = </span>
                            <input
                                type="text"
                                value={state.cFunc}
                                onChange={(e) => updateState("cFunc", e.target.value)}
                                className="font-math focus:outline-none max-w-32 border-b"
                            />
                        </div>

                       <button onClick={() => updateState("mouseC", !state.mouseC)}>
                           { state.mouseC ? iCursorFilled : iCursorOutline }
                       </button>
                    </div>
                </div>
            }

            <Header>Visuals</Header>
            {/* Flipping */}
            <div className="flex flex-col">
                <CheckboxInput value={state.xFlip} onChange={() => updateState("xFlip", -state.xFlip)} checked={state.xFlip===-1}>
                    Flip Horizontally
                </CheckboxInput>
                <CheckboxInput value={state.yFlip} onChange={() => updateState("yFlip", -state.yFlip)} checked={state.yFlip===-1}>
                    Flip Vertically
                </CheckboxInput>
                <CheckboxInput value={state.grid} onChange={() => updateState("grid", !state.grid)}>
                    Show Grid
                </CheckboxInput>
            </div>

        </div>
    );
};
