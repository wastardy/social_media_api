import { db } from '../connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPosts = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = 
            `SELECT p.*, u.id AS user_id, name, profile_picture 
            FROM posts AS p 
            JOIN users AS u 
                ON (u.id = p.user_id)
            LEFT JOIN relationships AS r 
                ON p.user_id = r.followed_user_id
            WHERE r.follower_user_id = ? 
                OR p.user_id = ?
            ORDER BY p.created_at DESC`;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json(data);
        });
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = "INSERT INTO posts (`desc`, `img`, `created_at`, `user_id`) VALUES (?)";

        const values = [
            req.body.desc, 
            req.body.img, 
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), 
            userInfo.id
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json('post has been created');
        });
    });
}