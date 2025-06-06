import {decode} from "@/urlEncoder";
import Viewer from "@/app/page";

export default async function Redirect({params}) {
    const {init} = await params;
    let state, view;
    if (init.length > 0) {
        const data = await decode(init);
        state = data.state;
        view = data.view;
    }
    return <Viewer initState={state} view={view} />;
}