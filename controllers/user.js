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