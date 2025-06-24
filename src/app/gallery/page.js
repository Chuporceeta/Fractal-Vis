import {CanvasCard} from "@/components/CanvasCard";
import {fetchFractals} from "@/app/db";
import GalleryUI from "@/app/gallery/GalleryUI";

export const defaultFilters = {
    p2c: 'true',
    p2z: 'true',
    mine: 'false',
    liked: 'false',
}

export default async function Gallery({searchParams}) {
    let {query, ...filters} = await searchParams;

    query = query ?? "";

    for (const [key, value] of Object.entries(defaultFilters))
        filters[key] = filters[key] ?? value;

    const data = await fetchFractals(20, query, filters);
    return (
            <GalleryUI>
                {data.map((fractal) => (
                    <CanvasCard key={fractal.id} id={fractal.id}
                                numLikes={fractal.numLikes} userLikes={fractal.liked}
                                state={fractal.state} view={fractal.view}/>
                ))}
            </GalleryUI>
    );
}