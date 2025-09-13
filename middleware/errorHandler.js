function errorHandler(err, req, res, next) {
	console.error(err.stack);

	if (err.name === "ValidationError") {
		return res.status(400).json({
			success: false,
			message: "Validation Error",
			errors: Object.values(err.errors).map((e) => e.message),
		});
	}

	if (err.name === "CastError") {
		return res.status(400).json({
			success: false,
			message: "Invalid ID format",
		});
	}

	if (err.code === 11000) {
		return res.status(400).json({
			success: false,
			message: "Duplicate entry found",
		});
	}

	res.status(500).json({
		success: false,
		message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
	});
}

export default errorHandler;
