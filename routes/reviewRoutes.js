import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';

const reviewrouter = express.Router();

// Public route to view reviews
reviewrouter.get('/:productId', getProductReviews);

// Route to post a review (handled securely because req.user must exist)
reviewrouter.post('/', createReview);

export default reviewrouter;