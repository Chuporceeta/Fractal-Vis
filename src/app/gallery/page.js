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
    const params = await searchParams;
    if (Object.keys(params).length === 0)
        return <GalleryUI count={-1}/>;

    let {query, page, rpp, cols, ...filters} = params;
    query ??= "";
    page ??= 1;
    rpp ??= 5;
    cols ??= 0;

    for (const [key, value] of Object.entries(defaultFilters))
        filters[key] = filters[key] ?? value;

    const {count, data} = await fetchFractals(rpp*cols, page, query, filters);
    return (
            <GalleryUI count={count} page={page} rowsPerPage={rpp} numCols={cols}>
                {data.map((fractal) => (
                    <CanvasCard key={fractal.id} id={fractal.id}
                                numLikes={fractal.numLikes} userLikes={fractal.liked}
                                state={fractal.state} view={fractal.view}/>
                ))}
            </GalleryUI>
    );
}