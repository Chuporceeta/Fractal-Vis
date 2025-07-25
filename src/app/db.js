'use server'
import postgres from "postgres";
import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt').value;
        const {username} = jwt.verify(token, process.env.JWT_SECRET);
        return username;
    } catch {
        return null;
    }
}

export async function logOut() {
    const cookieStore = await cookies();
    cookieStore.delete('jwt');
}

export async function setFractalLike(id, liked) {
    try {
        const username = await getCurrentUser();
        if (username === null) return `Error: Not signed in`;

        await sql.begin(async sql => {
            await sql`SELECT * FROM fractals WHERE id = ${id} FOR UPDATE`;
            if (liked) {
                await sql`INSERT INTO user_likes VALUES (${username}, ${id})`;
            } else {
                await sql`DELETE FROM user_likes WHERE username = ${username} AND fractal_id = ${id}`;
            }
            await sql`
                UPDATE fractals
                SET num_likes = num_likes ${liked ? sql`+` : sql`-`} 1
                WHERE id = ${id}
            `;
        });
        return 'success';
    } catch (error) {
        return error;
    }
}

export async function addFractal(state, view) {
    try {
        const username = await getCurrentUser();
        if (username === null) return `Error: Not signed in`;

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

export async function fetchFractals(pageSize, page, query, filters) {
    if (pageSize < 1)
        return {count: 0, data: []};
    try {
        const username = await getCurrentUser();

        const data = await sql`
            SELECT 
                fractals.*,
                CASE WHEN user_likes.username = ${username} THEN TRUE ELSE FALSE END AS liked,
                COUNT(*) OVER() as total_count
            FROM fractals
            LEFT JOIN user_likes
                ON fractals.id = user_likes.fractal_id
                AND user_likes.username = ${username}
            WHERE func_input LIKE ${`%${query}%`}
                AND ${filters.p2c === filters.p2z ? (filters.p2c === "true") : sql`pixel_to_c = ${filters.p2c === "true"}`}
                ${filters.mine === 'true' ? sql`AND creator = ${username}` : sql``}
                ${filters.liked === 'true' ? sql`AND user_likes.username = ${username}` : sql``}
            ORDER BY num_likes DESC
            LIMIT ${pageSize} OFFSET ${pageSize*(page-1)}
        `;

        let fractals = [];
        for (const fractal of data) {
            fractals.push({
                id: fractal.id,
                numLikes: fractal.num_likes,
                liked: fractal.liked,
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
        return {count: data[0].total_count, data: fractals};
    } catch (error) {
        console.error(error);
        return {count: 0, data: []};
    }
}

export async function handleLogin(username, password) {
    if (username in ['null', 'undefined'])
        return {success: false, msg: 'Illegal username.'};
    if (username.length < 4)
        return {success: false, msg: 'Username must be at least 4 characters long.'};

    if (/[\w-!@#$%^&*]*/.test(password) !== true)
        return {success: false, msg: 'Password may only contain alphanumeric characters or _-!@#$%^&*.'};
    if (password.length < 8 || password.length > 72)
        return {success: false, msg: 'Password must be between 8 and 72 characters inclusive.'};


    let res;
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
            res = {success: true, msg: "Successfully created account."};
        } else {
            const match = await bcrypt.compare(password, result.pass_hash);
            if (match === true) {
                res = {success: true, msg: "Successfully logged in."};
            } else
                res = {success: false, msg: "Incorrect username/password."};
        }
    } catch (error) {
        console.error(error);
        res = {success: false, msg: "Failed to log in."};
    }

    if (res.success) {
        const cookieStore = await cookies();
        const token = jwt.sign({username: username}, process.env.JWT_SECRET, {expiresIn: "7 days"});
        cookieStore.set({
            name: 'jwt',
            value: token,
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    return res;
}