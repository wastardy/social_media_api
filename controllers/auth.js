import { db } from '../connect.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
    // сheck if user EXIST
    console.log('---> register() Incoming registration data:', req.body);

    const q = 'SELECT * FROM users WHERE username = ?';
    
    db.query(q, [req.body.username], (err, data) => {
        if (err) {
            console.error('---> register() Database error during user lookup:', err);
            return res.status(500).json(err);
        }

        if (data.length) {
            console.log('---> register() Conflict: user already exists:', req.body.username);
            return res.status(409).json('user already exists');
        }

        // create new user & hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt); 

        const q = 'INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)';

        const userFields = [req.body.username, req.body.email, hashedPassword, req.body.name];

        db.query(q, [userFields], (err, data) => {
            if (err) {
                console.error('---> register() Database error during user creation:', err);
                return res.status(500).json(err);
            }

            console.log('---> register() User successfully created:', req.body.username);
            return res.status(200).json('user has been created');
        });
    });

    
}

export const login = (req, res) => {
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q, [req.body.username], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (data.length === 0) {
            return res.status(404).json('user not found.');
        }

        const checkPassword = bcrypt.compareSync(
            req.body.password, 
            data[0].password
        );

        if (!checkPassword) {
            return res.status(400).json('wrong password or username');
        }

        const token = jwt.sign({ id: data[0].id }, 'secretkey');

        const { password, ...others } = data[0];

        // cookie with name accessToken
        res.cookie('accessToken', token, {
            httpOnly: true,
        }).status(200).json(others);
    });
}

export const logout = (req, res) => {
    res.clearCookie('accessToken', {
        secure: true,
        sameSite: 'none'
    }).status(200).json('user has been logged out successfully');
}