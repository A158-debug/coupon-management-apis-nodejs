import Coupon from "../models/Coupon.js";
import CouponService from "../services/couponService.js";
import { validateCoupon, validateCart } from "../validators/couponValidator.js";

class CouponController {
	async createCoupon(req, res, next) {
		try {
			const { error } = validateCoupon(req.body);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}

			const coupon = await CouponService.createCoupon(req.body);
			res.status(201).json({
				success: true,
				data: coupon,
			});
		} catch (error) {
			next(error);
		}
	}

	async getAllCoupons(req, res, next) {
		try {
			const { page = 1, limit = 10, type, isActive } = req.query;
			const filters = {};

			if (type) filters.type = type;
			if (isActive !== undefined) filters.isActive = isActive === "true";

			const coupons = await Coupon.find(filters)
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.sort({ createdAt: -1 });

			const total = await Coupon.countDocuments(filters);

			res.json({
				success: true,
				data: coupons,
				pagination: {
					currentPage: parseInt(page),
					totalPages: Math.ceil(total / limit),
					totalItems: total,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async getCouponById(req, res, next) {
		try {
			const coupon = await Coupon.findById(req.params.id);
			if (!coupon) {
				return res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
			}

			res.json({
				success: true,
				data: coupon,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateCoupon(req, res, next) {
		try {
			const { error } = validateCoupon(req.body);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}

			const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

			if (!coupon) {
				return res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
			}

			res.json({
				success: true,
				data: coupon,
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteCoupon(req, res, next) {
		try {
			const coupon = await Coupon.findByIdAndDelete(req.params.id);
			if (!coupon) {
				return res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
			}

			res.json({
				success: true,
				message: "Coupon deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	}

	async getApplicableCoupons(req, res, next) {
		try {
			const { error } = validateCart(req.body);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}

			const applicableCoupons = await CouponService.getApplicableCoupons(req.body.cart);

			res.json({
				success: true,
				data: {
					applicable_coupons: applicableCoupons,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async applyCoupon(req, res, next) {
		try {
			const { error } = validateCart(req.body);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}

			const updatedCart = await Coupon.applyCoupon(req.params.id, req.body.cart);

			res.json({
				success: true,
				data: {
					updated_cart: updatedCart,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new CouponController();
