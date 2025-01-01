import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log("User ID:", userId);

    const q = `SELECT * FROM users WHERE id = ?`;

    db.query(q, [userId], (err, data) => {
        console.log("Data from DB:", data);

        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...info } = data[0];
        
        return res.json(info);
    });
}

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("not authenticated!");
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("token is not valid!");
        }

        const q = 
            `UPDATE users
            SET name = ?, 
                city = ?, 
                website = ?, 
                cover_picture = ?, 
                profile_picture = ?
            WHERE id = ?`;
        
        db.query(q, [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.cover_picture,
            req.body.profile_picture, 
            userInfo.id
        ], (error, data) => {
            if (error) {
                return res.status(500).json(err);
            }

            if (data.affectedRows > 0) {
                return res.json('user profile info has been updated');
            }

            return res.status(403).json('you can update only your post');
        });
    })
}