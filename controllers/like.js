import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getLikes = (req, res) => {
    const q = 
        `SELECT user_id FROM likes
        WHERE post_id = ?`;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data.map(like => like.user_id));
    });
} 

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
        
    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = 
            "INSERT INTO likes (`user_id`, `post_id`) VALUES (?)";

        const values = [
            userInfo.id, 
            req.body.postId
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json('post has been liked');
        });
    });
}

export const deleteLike = (req, res) => {
    console.log('it works');

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = 
            `DELETE FROM likes WHERE user_id = ? AND post_id = ?`;

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json('like has been deleted');
        });
    });
} 