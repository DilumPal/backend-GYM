import express from 'express';
import { createReview, getProductReviews, getHomepageTestimonials } from '../controllers/reviewController.js';

const reviewrouter = express.Router();

reviewrouter.get('/testimonials', getHomepageTestimonials); 
reviewrouter.get('/:productId', getProductReviews);
reviewrouter.post('/', createReview);

export default reviewrouter;