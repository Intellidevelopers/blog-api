import { query as _query } from '../config/db';

// Get All Posts
export function getPosts(req, res) {
  const query = 'SELECT * FROM posts';
  _query(query, (err, results) => {
    if (err) {
      return res.status(500).send({ message: 'Error fetching posts' });
    }
    res.send(results);
  });
}

// Get Post Details
export function getPostDetails(req, res) {
  const postId = req.params.id;
  const query = 'SELECT * FROM posts WHERE id = ?';
  _query(query, [postId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send({ message: 'Post not found' });
    }
    res.send(results[0]);
  });
}

// Create New Post
export function createPost(req, res) {
  const { title, content } = req.body;
  const userId = req.userId;

  const query = 'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)';
  _query(query, [userId, title, content], (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error creating post' });
    }
    res.status(201).send({ message: 'Post created successfully' });
  });
}
