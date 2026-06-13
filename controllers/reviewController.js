import Review from '../models/review.js';

// @desc    Create a new review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
        // req.user is populated by your authentication middleware in index.js
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const review = new Review({
            product: productId,
            user: req.user.id, // adjusting based on how your jwt payload is decoded
            reviewerName: req.user.name || "Anonymous User", 
            rating: Number(rating),
            comment
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a specific product
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Try to find the product document matching the custom string ID (e.g., "CARDIO002")
        let productDoc = await Product.findOne({ productID: productId });

        // 2. Fallback: If not found by custom ID, check if it's a valid MongoDB ObjectId
        if (!productDoc && productId.match(/^[0-9a-fA-F]{24}$/)) {
            productDoc = await Product.findById(productId);
        }

        // 3. If no product matches either identification strategy, return empty or 404
        if (!productDoc) {
            return res.status(200).json({
                reviews: [],
                stats: { averageRating: "0.0", totalReviews: 0 }
            });
        }

        // 4. Query reviews using the matching internal MongoDB _id
        const reviews = await Review.find({ product: productDoc._id }).sort({ createdAt: -1 });
        
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews 
            : 0;

        res.status(200).json({
            reviews,
            stats: {
                averageRating: averageRating.toFixed(1),
                totalReviews
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHomepageTestimonials = async (req, res) => {
    try {
        // Updated query pipeline: removes specific 5-star conditions to fetch all recent input
        const testimonials = await Review.find({}) 
            .sort({ createdAt: -1 }) // Keeps newest items first
            .limit(3) // Changed from 6 down to exactly 3 slots
            .populate('product', 'name'); 

        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};