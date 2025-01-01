import { db } from '../connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = 
            userId !== 'undefined' 
                ? `SELECT p.*, u.id AS user_id, name, profile_picture
                    FROM posts AS p
                    JOIN users AS u
                        ON (u.id = p.user_id)
                    WHERE p.user_id = ?
                    ORDER BY p.created_at DESC`

                : `SELECT p.*, u.id AS user_id, name, profile_picture 
                    FROM posts AS p 
                    JOIN users AS u 
                        ON (u.id = p.user_id)
                    LEFT JOIN relationships AS r 
                        ON (p.user_id = r.followed_user_id)
                    WHERE r.follower_user_id = ? 
                        OR p.user_id = ?
                    ORDER BY p.created_at DESC`;

        const values = 
            userId !== 'undefined' 
            ? [userId] 
            : [userInfo.id, userInfo.id]

        db.query(q, values, (err, data) => {
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

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = 
            `DELETE FROM posts WHERE id = ? AND user_id = ?`;

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (data.affectedRows > 0) {
                return res.status(200).json('post has been deleted');
            }

            return res.status(403).json('you can delete only your post');
        });
    });
}