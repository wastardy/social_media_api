import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getRelationships = (req, res) => {
    const q = 
        `SELECT follower_user_id FROM relationships
        WHERE followed_user_id = ?`;

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data.map(relationship => relationship.follower_user_id));
    });
} 

export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;
        
    if (!token) {
        return res.status(401).json('not logged in');
    }

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) {
            return res.status(403).json('token is not valid');
        }

        const q = 
            "INSERT INTO relationships (`follower_user_id`, `followed_user_id`) VALUES (?)";

        const values = [
            userInfo.id, 
            req.body.userId
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json('following');
        });
    });
}

export const deleteRelationship = (req, res) => {
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
            `DELETE FROM relationships WHERE follower_user_id = ? AND followed_user_id = ?`;

        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json('unfollow');
        });
    });
} 