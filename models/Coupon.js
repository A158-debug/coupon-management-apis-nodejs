import { Schema, model } from "mongoose";

const couponSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["cart-wise", "product-wise", "bxgy"],
		},
		description: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		usageLimit: {
			type: Number,
			default: null, // null means unlimited
		},
		usageCount: {
			type: Number,
			default: 0,
		},
		validFrom: {
			type: Date,
			default: Date.now,
		},
		validUntil: {
			type: Date,
			default: null, // null means no expiration
		},
		minimumOrderAmount: {
			type: Number,
			default: 0,
		},
		maximumDiscountAmount: {
			type: Number,
			default: null, // null means no cap
		},

		// Cart-wise specific fields
		cartWiseDetails: {
			threshold: {
				type: Number,
				required: function () {
					return this.type === "cart-wise";
				},
			},
			discount: {
				type: Number,
				required: function () {
					return this.type === "cart-wise";
				},
			},
			discountType: {
				type: String,
				enum: ["percentage", "fixed"],
				default: "percentage",
			},
		},

		// Product-wise specific fields
		productWiseDetails: {
			productIds: [
				{
					type: Number,
					required: function () {
						return this.type === "product-wise";
					},
				},
			],
			discount: {
				type: Number,
				required: function () {
					return this.type === "product-wise";
				},
			},
			discountType: {
				type: String,
				enum: ["percentage", "fixed"],
				default: "percentage",
			},
			categories: [String], // Optional: apply to categories
			brands: [String], // Optional: apply to brands
			excludeProducts: [Number], // Products to exclude from discount
		},

		// BxGy specific fields
		bxgyDetails: {
			buyProducts: [
				{
					productId: {
						type: Number,
						required: function () {
							return this.type === "bxgy";
						},
					},
					quantity: {
						type: Number,
						required: function () {
							return this.type === "bxgy";
						},
						min: 1,
					},
				},
			],
			getProducts: [
				{
					productId: {
						type: Number,
						required: function () {
							return this.type === "bxgy";
						},
					},
					quantity: {
						type: Number,
						required: function () {
							return this.type === "bxgy";
						},
						min: 1,
					},
				},
			],
			repetitionLimit: {
				type: Number,
				required: function () {
					return this.type === "bxgy";
				},
				min: 2,
			},
			buyQuantityThreshold: {
				type: Number,
				required: function () {
					return this.type === "bxgy";
				},
				min: 1,
			},
		},

		// Advanced constraints
		constraints: {
			applicableUserTypes: [String], // ['new', 'existing', 'premium']
			excludedUserIds: [String],
			dayOfWeek: [Number], // 0-6 (Sunday-Saturday)
			timeRange: {
				start: String, // HH:MM format
				end: String, // HH:MM format
			},
			minimumCartQuantity: Number,
			maximumCartQuantity: Number,
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for better performance
couponSchema.index({ code: 1 });
couponSchema.index({ type: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });

export default model("Coupon", couponSchema);
