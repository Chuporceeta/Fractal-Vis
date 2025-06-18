'use server'
import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

export async function addFractal(state, view, username) {
    try {
        await sql`
            INSERT INTO fractals (max_iter, rad, t, pixel_to_c, iter_func, func_input, c_func, x_flip, y_flip, view, creator)
            VALUES (${state.maxIter}, ${state.rad}, ${state.t}, ${state.pixelToC}, ${state.iterFunc}, ${state.funcInput},
                    ${state.cFunc}, ${state.xFlip===-1}, ${state.yFlip===-1}, ${view}, ${username})
        `;
        return 'success';
    } catch (error) {
        return error;
    }
}

export async function fetchFractals(limit, query, filters) {
    console.log(query, filters);
    try {
        const data = await sql`
            SELECT * FROM fractals
            WHERE func_input LIKE ${`%${query}%`}
            AND ${filters.p2c === filters.p2z ? (filters.p2c === "true") : sql`pixel_to_c = ${filters.p2c === "true"}`}
            ORDER BY likes DESC
            LIMIT ${limit}
        `;

        let fractals = [];
        for (const fractal of data) {
            fractals.push({
                key: fractal.id,
                likes: fractal.likes,
                state: {
                    maxIter: fractal.max_iter,
                    rad: fractal.rad,
                    t: fractal.t,
                    pixelToC: fractal.pixel_to_c,
                    iterFunc: fractal.iter_func,
                    funcInput: fractal.func_input,
                    cFunc: fractal.c_func,
                    xFlip: fractal.x_flip ? -1 : 1,
                    yFlip: fractal.y_flip ? -1 : 1,
                },
                view: fractal.view,
            });
        }
        return fractals;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function handleLogin(username, password) {
    let res = "";
    try {
        const [result] = await sql`
            SELECT pass_hash FROM users
            WHERE username = ${username}
        `;
        if (result === undefined) {
            const hash = await bcrypt.hash(password, 10);
            await sql`
                INSERT INTO users (username, pass_hash)
                VALUES (${username}, ${hash})
            `;
            res = {success: true, msg: "Successfully created account"};
        } else {
            const match = await bcrypt.compare(password, result.pass_hash);
            if (match === true) {
                res = {success: true, msg: "Successfully logged in"};
            } else
                res = {success: false, msg: "Incorrect username/password."};
        }
    } catch (error) {
        console.log(error);
        res = {success: false, msg: "Failed to log in"};
    }
    return res;
}