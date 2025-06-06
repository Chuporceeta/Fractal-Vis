import {iPause, iPlay} from "@/components/icons";

export const TimeSlider = ({ state, updateState }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 z-50 flex items-center gap-2">
            <button onClick={() => {updateState("paused", !state.paused);}}>
                { state.paused ? iPause : iPlay }
            </button>
            <span className="font-math italic text-gray-300">t</span>
            <input
                type="range"
                min={0}
                max={6.28}
                step={0.01}
                value={state.t}
                onChange={(e) => updateState("t", parseFloat(e.target.value))}
                className="w-full appearance-none h-1 bg-gray-300 rounded-lg outline-none
                   transition-all duration-200"
            />
            <input
                type="number"
                min={0}
                step={0.01}
                value={state.tLoop}
                onChange={(e) => updateState("tLoop", parseFloat(e.target.value))}
                className="w-15 text-gray-300"
            />
        </div>
    );
};