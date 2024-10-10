import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

let posts = []; // In-memory storage for posts (use a real database in production)

// Get all posts
router.get('/posts', (req, res) => {
  res.status(200).json({ posts });
});

// Get post details by ID
router.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json({ post });
});

// Create a post with image upload (protected)
router.post('/posts', authenticateToken, upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Get the uploaded image path

  const newPost = { id: posts.length + 1, title, content, author: req.user.id, imageUrl };
  posts.push(newPost);
  
  res.status(201).json({ message: 'Post created successfully', post: newPost });
});

// Middleware for verifying JWT (authentication)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export default router;
