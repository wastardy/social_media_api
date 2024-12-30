import { db } from "../connect.js";


export const getPosts = (req, res) => {
    const q = `SELECT p.*, u.id AS user_id, name, profile_picture FROM posts AS p JOIN users AS u ON (u.id = p.user_id)`;

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data);
    });
}