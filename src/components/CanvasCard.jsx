'use client'
import {WebGLCanvas} from "@/components/WebGLCanvas";
import {useRouter} from "next/navigation";
import {encode} from "@/urlEncoder";

export const CanvasCard = ({state, view}) => {
    const stateRef = {
        current: state
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