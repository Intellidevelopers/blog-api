import { query as _query } from '../config/db';
import { hashSync, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// Register User
export function register(req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = hashSync(password, 8);

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  _query(query, [name, email, hashedPassword], (err) => {
    if (err) {
      return res.status(500).send({ message: 'User registration failed', err });
    }
    res.status(201).send({ message: 'User registered successfully' });
  });
}

// Login User
export function login(req, res) {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  _query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = sign({ id: user.id }, 'secret-key', { expiresIn: '1h' });
    res.send({ message: 'Login successful', token });
  });
}

// Get User Profile
export function profile(req, res) {
  const userId = req.userId;
  const query = 'SELECT id, name, email FROM users WHERE id = ?';
  _query(query, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(results[0]);
  });
}
