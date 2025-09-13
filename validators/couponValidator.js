import Joi from "joi";

const couponSchema = Joi.object({
	code: Joi.string().required().uppercase(),
	type: Joi.string().valid("cart-wise", "product-wise", "bxgy").required(),
	description: Joi.string().required(),
	isActive: Joi.boolean().default(true),
	usageLimit: Joi.number().min(1).allow(null),
	validFrom: Joi.date().default(Date.now),
	validUntil: Joi.date().allow(null),
	minimumOrderAmount: Joi.number().min(0).default(0),
	maximumDiscountAmount: Joi.number().min(0).allow(null),

	cartWiseDetails: Joi.when("type", {
		is: "cart-wise",
		then: Joi.object({
			threshold: Joi.number().min(0).required(),
			discount: Joi.number().min(0).required(),
			discountType: Joi.string().valid("percentage", "fixed").default("percentage"),
		}).required(),
		otherwise: Joi.forbidden(),
	}),

	productWiseDetails: Joi.when("type", {
		is: "product-wise",
		then: Joi.object({
			productIds: Joi.array().items(Joi.number()).min(1).required(),
			discount: Joi.number().min(0).required(),
			discountType: Joi.string().valid("percentage", "fixed").default("percentage"),
			categories: Joi.array().items(Joi.string()),
			brands: Joi.array().items(Joi.string()),
			excludeProducts: Joi.array().items(Joi.number()),
		}).required(),
		otherwise: Joi.forbidden(),
	}),

	bxgyDetails: Joi.when("type", {
		is: "bxgy",
		then: Joi.object({
			buyProducts: Joi.array()
				.items(
					Joi.object({
						productId: Joi.number().required(),
						quantity: Joi.number().min(1).required(),
					})
				)
				.min(1)
				.required(),
			getProducts: Joi.array()
				.items(
					Joi.object({
						productId: Joi.number().required(),
						quantity: Joi.number().min(1).required(),
					})
				)
				.min(1)
				.required(),
			repetitionLimit: Joi.number().min(1).required(),
			buyQuantityThreshold: Joi.number().min(1).required(),
		}).required(),
		otherwise: Joi.forbidden(),
	}),
});

const cartSchema = Joi.object({
	items: Joi.array()
		.items(
			Joi.object({
				product_id: Joi.number().required(),
				quantity: Joi.number().min(1).required(),
				price: Joi.number().min(0).required(),
			})
		)
		.min(1)
		.required(),
});

function validateCoupon(coupon) {
	return couponSchema.validate(coupon);
}

function validateCart(cart) {
	return cartSchema.validate(cart);
}

export { validateCoupon, validateCart };
