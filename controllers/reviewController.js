import Review from '../models/review.js';
import Product from '../models/product.js';
import User from '../models/user.js';

export const createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        let productDoc = await Product.findOne({ productID: productId });

        if (!productDoc && productId.match(/^[0-9a-fA-F]{24}$/)) {
            productDoc = await Product.findById(productId);
        }

        if (!productDoc) {
            return res.status(404).json({ message: "Product not found to add review" });
        }

        // 👈 FIND THE USER OBJECT VIA THE EMAIL FROM THE TOKEN
        const userDoc = await User.findOne({ email: req.user.email });
        if (!userDoc) {
            return res.status(404).json({ message: "User account not found" });
        }
        
        const reviewerName = `${req.user.firstName} ${req.user.lastName}`.trim();
        
        const review = new Review({
            product: productDoc._id,
            user: userDoc._id, // 👈 FIX: Pass the newly found user document ID here
            reviewerName: reviewerName || "Anonymous Buyer",
            rating: Number(rating),
            comment
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        let productDoc = await Product.findOne({ productID: productId });

        if (!productDoc && productId.match(/^[0-9a-fA-F]{24}$/)) {
            productDoc = await Product.findById(productId);
        }

        if (!productDoc) {
            return res.status(200).json({
                reviews: [],
                stats: { averageRating: "0.0", totalReviews: 0 }
            });
        }

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
        const testimonials = await Review.find({}) 
            .sort({ createdAt: -1 }) 
            .limit(3) 
            .populate('product', 'name'); 

        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};