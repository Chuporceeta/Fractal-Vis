import {CanvasCard} from "@/components/CanvasCard";
import {fetchFractals} from "@/app/db";

export default async function Gallery() {
    const data = await fetchFractals(10);

    return (
        <div className="grid grid-cols-5">
            {data.map((fractal) => (
                <CanvasCard key={fractal.key} state={fractal.state} view={fractal.view}/>
            ))}
        </div>
    );
}