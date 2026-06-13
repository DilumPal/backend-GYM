import express from 'express';
import { createReview, getProductReviews, getHomepageTestimonials } from '../controllers/reviewController.js';

const reviewrouter = express.Router();

reviewrouter.get('/testimonials', getHomepageTestimonials); // New route for homepage testimonials
// Public route to view reviews
reviewrouter.get('/:productId', getProductReviews);

// Route to post a review (handled securely because req.user must exist)
reviewrouter.post('/', createReview);

export default reviewrouter;