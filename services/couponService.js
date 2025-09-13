import Coupon from "../models/Coupon.js";

class CouponService {
	async createCoupon(couponData) {
		const coupon = new Coupon(couponData);
		return await coupon.save();
	}

	async getApplicableCoupons(cart) {
		const activeCoupons = await Coupon.find({
			isActive: true,
			$or: [{ validUntil: null }, { validUntil: { $gte: new Date() } }],
			validFrom: { $lte: new Date() },
		});

		const applicableCoupons = [];
		const cartTotal = this.calculateCartTotal(cart);

		for (const coupon of activeCoupons) {
			if (this.isCouponApplicable(coupon, cart, cartTotal)) {
				const discount = this.calculateDiscount(coupon, cart, cartTotal);
				applicableCoupons.push({
					coupon_id: coupon._id,
					type: coupon.type,
					code: coupon.code,
					discount: discount,
					description: coupon.description,
				});
			}
		}

		// Sort by discount amount (highest first)
		return applicableCoupons.sort((a, b) => b.discount - a.discount);
	}

	async applyCoupon(couponId, cart) {
		const coupon = await findById(couponId);
		if (!coupon) {
			throw new Error("Coupon not found");
		}

		if (!coupon.isActive) {
			throw new Error("Coupon is not active");
		}

		if (coupon.validUntil && coupon.validUntil < new Date()) {
			throw new Error("Coupon has expired");
		}

		if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
			throw new Error("Coupon usage limit exceeded");
		}

		const cartTotal = this.calculateCartTotal(cart);

		if (!this.isCouponApplicable(coupon, cart, cartTotal)) {
			throw new Error("Coupon is not applicable to this cart");
		}

		const updatedCart = this.applyDiscountToCart(coupon, cart, cartTotal);

		// Update usage count
		await findByIdAndUpdate(couponId, {
			$inc: { usageCount: 1 },
		});

		return updatedCart;
	}

	calculateCartTotal(cart) {
		return cart.items.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);
	}

	isCouponApplicable(coupon, cart, cartTotal) {
		// Check minimum order amount
		if (cartTotal < coupon.minimumOrderAmount) {
			return false;
		}

		switch (coupon.type) {
			case "cart-wise":
				return this.isCartWiseCouponApplicable(coupon, cart, cartTotal);
			case "product-wise":
				return this.isProductWiseCouponApplicable(coupon, cart);
			case "bxgy":
				return this.isBxGyCouponApplicable(coupon, cart);
			default:
				return false;
		}
	}

	isCartWiseCouponApplicable(coupon, cart, cartTotal) {
		return cartTotal >= coupon.cartWiseDetails.threshold;
	}

	isProductWiseCouponApplicable(coupon, cart) {
		const cartProductIds = cart.items.map((item) => item.product_id);
		return coupon.productWiseDetails.productIds.some((productId) => cartProductIds.includes(productId));
	}

	isBxGyCouponApplicable(coupon, cart) {
		const { buyProducts, buyQuantityThreshold } = coupon.bxgyDetails;

		// Count quantities of buy products in cart
		let totalBuyQuantity = 0;
		for (const buyProduct of buyProducts) {
			const cartItem = cart.items.find((item) => item.product_id === buyProduct.productId);
			if (cartItem) {
				totalBuyQuantity += cartItem.quantity;
			}
		}

		return totalBuyQuantity >= buyQuantityThreshold;
	}

	calculateDiscount(coupon, cart, cartTotal) {
		switch (coupon.type) {
			case "cart-wise":
				return this.calculateCartWiseDiscount(coupon, cartTotal);
			case "product-wise":
				return this.calculateProductWiseDiscount(coupon, cart);
			case "bxgy":
				return this.calculateBxGyDiscount(coupon, cart);
			default:
				return 0;
		}
	}

	calculateCartWiseDiscount(coupon, cartTotal) {
		const { discount, discountType } = coupon.cartWiseDetails;
		let calculatedDiscount = 0;

		if (discountType === "percentage") {
			calculatedDiscount = (cartTotal * discount) / 100;
		} else {
			calculatedDiscount = discount;
		}

		// Apply maximum discount cap if exists
		if (coupon.maximumDiscountAmount && calculatedDiscount > coupon.maximumDiscountAmount) {
			calculatedDiscount = coupon.maximumDiscountAmount;
		}

		return Math.min(calculatedDiscount, cartTotal);
	}

	calculateProductWiseDiscount(coupon, cart) {
		const { productIds, discount, discountType } = coupon.productWiseDetails;
		let totalDiscount = 0;

		for (const item of cart.items) {
			if (productIds.includes(item.product_id)) {
				const itemTotal = item.price * item.quantity;
				let itemDiscount = 0;

				if (discountType === "percentage") {
					itemDiscount = (itemTotal * discount) / 100;
				} else {
					itemDiscount = discount * item.quantity;
				}

				totalDiscount += itemDiscount;
			}
		}

		// Apply maximum discount cap if exists
		if (coupon.maximumDiscountAmount && totalDiscount > coupon.maximumDiscountAmount) {
			totalDiscount = coupon.maximumDiscountAmount;
		}

		return totalDiscount;
	}

	calculateBxGyDiscount(coupon, cart) {
		const { buyProducts, getProducts, repetitionLimit, buyQuantityThreshold } = coupon.bxgyDetails;

		// Count buy products in cart
		let totalBuyQuantity = 0;
		for (const buyProduct of buyProducts) {
			const cartItem = cart.items.find((item) => item.product_id === buyProduct.productId);
			if (cartItem) {
				totalBuyQuantity += cartItem.quantity;
			}
		}

		// Calculate how many times the offer can be applied
		const possibleApplications = Math.floor(totalBuyQuantity / buyQuantityThreshold);
		const actualApplications = Math.min(possibleApplications, repetitionLimit);

		// Calculate free product value
		let freeProductValue = 0;
		for (const getProduct of getProducts) {
			const cartItem = cart.items.find((item) => item.product_id === getProduct.productId);
			if (cartItem) {
				const freeQuantity = Math.min(getProduct.quantity * actualApplications, cartItem.quantity);
				freeProductValue += freeQuantity * cartItem.price;
			}
		}

		return freeProductValue;
	}

	applyDiscountToCart(coupon, cart, cartTotal) {
		const updatedCart = {
			items: cart.items.map((item) => ({
				...item,
				total_discount: 0,
				discounted_price: item.price,
				free_quantity: 0,
			})),
			total_price: cartTotal,
			total_discount: 0,
			final_price: cartTotal,
			applied_coupon: {
				id: coupon._id,
				code: coupon.code,
				type: coupon.type,
			},
		};

		switch (coupon.type) {
			case "cart-wise":
				this.applyCartWiseDiscount(coupon, updatedCart);
				break;
			case "product-wise":
				this.applyProductWiseDiscount(coupon, updatedCart);
				break;
			case "bxgy":
				this.applyBxGyDiscount(coupon, updatedCart);
				break;
		}

		return updatedCart;
	}

	applyCartWiseDiscount(coupon, updatedCart) {
		const discount = this.calculateCartWiseDiscount(coupon, updatedCart.total_price);
		updatedCart.total_discount = discount;
		updatedCart.final_price = updatedCart.total_price - discount;

		// Distribute discount proportionally across items
		const discountRatio = discount / updatedCart.total_price;
		updatedCart.items.forEach((item) => {
			const itemTotal = item.price * item.quantity;
			item.total_discount = itemTotal * discountRatio;
			item.discounted_price = item.price * (1 - discountRatio);
		});
	}

	applyProductWiseDiscount(coupon, updatedCart) {
		const { productIds, discount, discountType } = coupon.productWiseDetails;
		let totalDiscount = 0;

		updatedCart.items.forEach((item) => {
			if (productIds.includes(item.product_id)) {
				const itemTotal = item.price * item.quantity;
				let itemDiscount = 0;

				if (discountType === "percentage") {
					itemDiscount = (itemTotal * discount) / 100;
					item.discounted_price = item.price * (1 - discount / 100);
				} else {
					itemDiscount = discount * item.quantity;
					item.discounted_price = item.price - discount;
				}

				item.total_discount = itemDiscount;
				totalDiscount += itemDiscount;
			}
		});

		updatedCart.total_discount = totalDiscount;
		updatedCart.final_price = updatedCart.total_price - totalDiscount;
	}

	applyBxGyDiscount(coupon, updatedCart) {
		const { buyProducts, getProducts, repetitionLimit, buyQuantityThreshold } = coupon.bxgyDetails;

		// Count buy products in cart
		let totalBuyQuantity = 0;
		for (const buyProduct of buyProducts) {
			const cartItem = updatedCart.items.find((item) => item.product_id === buyProduct.productId);
			if (cartItem) {
				totalBuyQuantity += cartItem.quantity;
			}
		}

		const possibleApplications = Math.floor(totalBuyQuantity / buyQuantityThreshold);
		const actualApplications = Math.min(possibleApplications, repetitionLimit);

		let totalDiscount = 0;

		// Apply free products
		for (const getProduct of getProducts) {
			const cartItem = updatedCart.items.find((item) => item.product_id === getProduct.productId);
			if (cartItem) {
				const freeQuantity = Math.min(getProduct.quantity * actualApplications, cartItem.quantity);

				const freeValue = freeQuantity * cartItem.price;
				cartItem.free_quantity = freeQuantity;
				cartItem.total_discount = freeValue;
				totalDiscount += freeValue;
			}
		}

		updatedCart.total_discount = totalDiscount;
		updatedCart.final_price = updatedCart.total_price - totalDiscount;
	}
}

export default new CouponService();
