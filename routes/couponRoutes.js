import { Router } from 'express';
import CouponController from '../controllers/couponController.js';

const router = Router();

router.post('/coupons', CouponController.createCoupon);
router.get('/coupons', CouponController.getAllCoupons);
router.get('/coupons/:id', CouponController.getCouponById);
router.put('/coupons/:id', CouponController.updateCoupon);
router.delete('/coupons/:id', CouponController.deleteCoupon);
router.post('/applicable-coupons', CouponController.getApplicableCoupons);
router.post('/apply-coupon/:id', CouponController.applyCoupon);

export default router;
