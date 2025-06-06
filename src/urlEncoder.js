export async function encode(state, view) {
    const stream = new Blob([JSON.stringify({state, view})]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream("deflate"));
    const compressedResponse = await new Response(compressedStream);
    const bytes = await compressedResponse.bytes();
    const b64 = btoa(String.fromCharCode(...bytes));
    return encodeURIComponent(b64);
}

export async function decode(enc) {
    const byteString = atob(decodeURIComponent(enc));
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++)
        bytes[i] = byteString.charCodeAt(i);
    const compressedStream = new Blob([bytes]).stream();
    const stream = compressedStream.pipeThrough(new DecompressionStream("deflate"));
    const response = await new Response(stream);
    const blob = await response.blob();
    const text = await blob.text();
    return JSON.parse(text);
}