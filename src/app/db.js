'use server'
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

export async function addFractal(state, view) {
    try {
        await sql`
            INSERT INTO fractals (state, view)
            VALUES (${JSON.stringify(state)}, ${JSON.stringify(view)})
        `;
        return 'success';
    } catch (error) {
        return error;
    }
}

export async function fetchFractals(limit) {
    try {
        const data = await sql`
            SELECT * FROM fractals
            LIMIT ${limit}
        `;
        let fractals = [];
        for (const fractal of data) {
            fractals.push({
                key: fractal.id,
                state: JSON.parse(fractal.state),
                view: JSON.parse(fractal.view),
            });
        }
        return fractals;
    } catch (error) {
        return error;
    }
}