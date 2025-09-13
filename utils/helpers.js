class CouponHelpers {
	/**
	 * Generate random coupon code
	 */
	static generateCouponCode(length = 8) {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	/**
	 * Validate date range
	 */
	static isValidDateRange(startDate, endDate) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		return start < end;
	}

	/**
	 * Calculate percentage
	 */
	static calculatePercentage(amount, percentage) {
		return (amount * percentage) / 100;
	}

	/**
	 * Round to 2 decimal places
	 */
	static roundToTwo(num) {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	}

	/**
	 * Check if current time is within time range
	 */
	static isWithinTimeRange(startTime, endTime) {
		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();

		const [startHour, startMin] = startTime.split(":").map(Number);
		const [endHour, endMin] = endTime.split(":").map(Number);

		const start = startHour * 60 + startMin;
		const end = endHour * 60 + endMin;

		if (start <= end) {
			return currentTime >= start && currentTime <= end;
		} else {
			// Handle overnight time range
			return currentTime >= start || currentTime <= end;
		}
	}

	/**
	 * Check if current day is in allowed days
	 */
	static isValidDay(allowedDays) {
		const currentDay = new Date().getDay();
		return allowedDays.includes(currentDay);
	}

	/**
	 * Format currency
	 */
	static formatCurrency(amount, currency = "INR") {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: currency,
		}).format(amount);
	}

	/**
	 * Deep clone object
	 */
	static deepClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	/**
	 * Calculate cart statistics
	 */
	static getCartStatistics(cart) {
		const stats = {
			totalItems: 0,
			totalQuantity: 0,
			totalValue: 0,
			uniqueProducts: new Set(),
			averageItemPrice: 0,
			categoryDistribution: {},
		};

		cart.items.forEach((item) => {
			stats.totalItems++;
			stats.totalQuantity += item.quantity;
			stats.totalValue += item.price * item.quantity;
			stats.uniqueProducts.add(item.product_id);

			// Category distribution would require product metadata
			// This is a placeholder for future enhancement
		});

		stats.averageItemPrice = stats.totalValue / stats.totalQuantity;

		return stats;
	}
}

module.exports = CouponHelpers;
