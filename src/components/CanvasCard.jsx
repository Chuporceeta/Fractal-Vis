'use client'
import {WebGLCanvas} from "@/components/WebGLCanvas";
import {useRouter} from "next/navigation";
import {encode} from "@/urlEncoder";

export const CanvasCard = (props) => {
    const state = {
        maxIter: 100,
        rad: 2,
        t: 0,
        pixelToC: true,
        iterFunc: "ccosh(pow(abs(z), 2))",
        funcInput: "cosh(pow(abs(z), 2))",
        cFunc: "0.7885*cis(t)",
        xFlip: 1,
        yFlip: 1,
    };
    const stateRef = {
        current: state
    }

    const view = {
        zoom: 1.0,
        xPanOffset: 15,
        yPanOffset: 0,
        xZoomOffset: 0,
        yZoomOffset: 0,
    }

    const router = useRouter();
    return (
        <div className="w-32 h-32 m-2 relative hover:transition-transform duration-200 hover:scale-110"
             onClick={async () => {
                 const enc = await encode(state, view);
                 router.push(`/${enc}`)
             }}
        >
            <WebGLCanvas view={view} stateRef={stateRef}/>
            <div
                className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 hover:bg-gray-600/50 flex justify-center items-end">
                <span className="m-3 text-gray-200 text-balance select-none">
                    {state.funcInput}
                </span>
            </div>
        </div>
    )
}