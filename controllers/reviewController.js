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
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        
        // Calculate dynamic stats if needed on the fly
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