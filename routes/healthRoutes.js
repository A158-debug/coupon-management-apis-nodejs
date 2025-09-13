import { Router } from "express";
import { connection } from "mongoose";
const router = Router();

router.get("/health", async (req, res) => {
	try {
		// Check database connection
		const dbStatus = connection.readyState === 1 ? "connected" : "disconnected";

		const healthCheck = {
			status: "OK",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			database: dbStatus,
			memory: process.memoryUsage(),
			version: process.env.npm_package_version || "1.0.0",
		};

		res.json(healthCheck);
	} catch (error) {
		res.status(503).json({
			status: "ERROR",
			message: error.message,
		});
	}
});

export default router;
