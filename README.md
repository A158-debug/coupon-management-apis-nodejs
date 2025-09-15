# Coupon Management API

A comprehensive RESTful API for managing and applying different types of discount coupons in an e-commerce platform, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Multiple Coupon Types**: Cart-wise, Product-wise, and BxGy (Buy X Get Y) coupons
- **Advanced Validation**: Comprehensive input validation using Joi
- **Flexible Constraints**: Time-based, user-based, and quantity-based restrictions
- **Usage Tracking**: Monitor coupon usage and enforce limits
- **Extensible Architecture**: Easy to add new coupon types
- **Error Handling**: Robust error handling and meaningful responses
- **Performance Optimized**: Database indexing and efficient queries

## 📋 Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Coupon Types](#coupon-types)
- [Use Cases](#use-cases)
  - [Implemented Cases](#implemented-cases)
  - [Unimplemented Cases](#unimplemented-cases)
- [Limitations](#limitations)
- [Assumptions](#assumptions)
- [Examples](#examples)
- [Testing](#testing)

## 🛠 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd coupon-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coupons` | Create a new coupon |
| GET | `/api/coupons` | Get all coupons (with pagination) |
| GET | `/api/coupons/:id` | Get a specific coupon |
| PUT | `/api/coupons/:id` | Update a coupon |
| DELETE | `/api/coupons/:id` | Delete a coupon |
| POST | `/api/applicable-coupons` | Get applicable coupons for a cart |
| POST | `/api/apply-coupon/:id` | Apply a coupon to a cart |

## 🎯 Coupon Types

### 1. Cart-wise Coupons
Apply discounts to the entire cart based on total amount threshold.

**Examples:**
- 10% off on orders above ₹500
- ₹100 flat discount on orders above ₹1000
- Free shipping on orders above ₹750

### 2. Product-wise Coupons
Apply discounts to specific products, categories, or brands.

**Examples:**
- 20% off on Electronics category
- ₹50 off on Samsung products
- Buy 2 Get 1 Free on Books

### 3. BxGy Coupons (Buy X Get Y)
Complex promotional offers with repetition limits.

**Examples:**
- Buy 2 Get 1 Free (B2G1)
- Buy 3 products from [X, Y, Z], get 1 from [A, B, C] free
- Buy ₹1000 worth products, get shipping free

## 📊 Use Cases

### ✅ Implemented Cases

#### Cart-wise Coupons
1. **Percentage Discount**: 10% off on cart total above ₹500
2. **Fixed Amount Discount**: ₹100 off on cart total above ₹1000
3. **Maximum Discount Cap**: 20% off with maximum discount of ₹500
4. **Minimum Order Amount**: Coupon valid only above certain cart value
5. **Usage Limit**: Limit coupon usage to N times globally
6. **Expiration Date**: Time-bound coupons with validity period

#### Product-wise Coupons
1. **Single Product Discount**: 15% off on Product ID 123
2. **Multiple Product Discount**: 20% off on products [1, 2, 3]
3. **Category-based Discount**: 25% off on Electronics category
4. **Brand-based Discount**: 30% off on Nike products
5. **Exclude Products**: Apply to category but exclude specific products
6. **Fixed vs Percentage**: Both ₹50 off and 10% off options

#### BxGy Coupons
1. **Basic B2G1**: Buy 2, Get 1 Free from same product set
2. **Cross-product BxGy**: Buy from set [X, Y], get from set [A, B]
3. **Quantity Threshold**: Buy minimum 3 items to activate offer
4. **Repetition Limit**: Apply offer maximum 3 times per order
5. **Mixed Quantities**: Buy 6 items, get 3 free (2 applications of B2G1)
6. **Partial Application**: Handle cases where get products are fewer than eligible

#### Advanced Features
1. **Coupon Stacking Prevention**: Only one coupon per order
2. **Usage Tracking**: Track how many times a coupon is used
3. **Active/Inactive Status**: Enable/disable coupons
4. **Validity Period**: From and until dates
5. **User Type Restrictions**: New users, premium users, etc.
6. **Time-based Restrictions**: Day of week, time range limitations

### ❌ Unimplemented Cases (Future Enhancements)

#### Complex Business Rules
1. **Coupon Stacking**: Allow multiple coupons with priority rules
2. **Graduated Discounts**: Different discount rates based on cart value tiers
3. **Customer Segmentation**: Personalized coupons based on purchase history
4. **Dynamic Pricing**: Real-time discount adjustments based on inventory
5. **Geographic Restrictions**: Location-based coupon availability

#### Advanced BxGy Scenarios
1. **Tiered BxGy**: Buy 2 get 1, Buy 4 get 3, Buy 6 get 5
2. **Progressive Discounts**: Increasing discount with more items
3. **Cross-category BxGy**: Buy from Category A, get from Category B
4. **Value-based BxGy**: Buy ₹X worth, get ₹Y worth free
5. **Conditional BxGy**: Additional conditions like minimum brand value

#### Integration Complexities
1. **Inventory Integration**: Check product availability before applying
2. **Tax Calculations**: Handle tax implications of discounts
3. **Payment Gateway Integration**: Process discounted amounts
4. **Loyalty Points**: Convert coupons to/from loyalty points
5. **Referral Integration**: Combine with referral programs

#### Performance & Scalability
1. **Real-time Analytics**: Track coupon performance metrics
2. **A/B Testing**: Test different coupon strategies
3. **Bulk Operations**: Handle thousands of coupons efficiently
4. **Caching Layer**: Redis integration for better performance
5. **Rate Limiting**: Prevent abuse of coupon endpoints

## 🚧 Limitations

### Current Implementation Limitations

1. **Single Coupon Application**: Only one coupon can be applied per cart
2. **No Inventory Check**: Doesn't verify product availability
3. **Basic User Management**: No user authentication/authorization
4. **Limited Analytics**: No detailed usage analytics or reporting
5. **No Audit Trail**: Changes to coupons are not tracked
6. **Memory-based Calculations**: No persistent calculation cache

### Technical Limitations

1. **Database Transactions**: No atomic operations for coupon usage
2. **Concurrency**: Race conditions possible in high-traffic scenarios
3. **Data Validation**: Limited validation for product existence
4. **Error Recovery**: No rollback mechanism for failed applications
5. **Monitoring**: No health checks or performance monitoring

### Business Logic Limitations

1. **Tax Handling**: Discounts applied before tax calculations
2. **Shipping Costs**: No integration with shipping calculations
3. **Return/Refund**: No handling of coupon refunds on returns
4. **Currency**: Single currency support only
5. **Localization**: No multi-language support

## 📝 Assumptions

### Data Assumptions
1. **Product IDs**: Products are identified by numeric IDs
2. **Price Format**: Prices are stored as numbers (no currency formatting)
3. **Cart Structure**: Cart items have product_id, quantity, and price
4. **Unique Coupon Codes**: Each coupon has a unique alphanumeric code

### Business Logic Assumptions
1. **Discount Priority**: Product-specific discounts take precedence over cart-wide
2. **Rounding**: Discount amounts are rounded to 2 decimal places
3. **Negative Discounts**: Discounts cannot exceed item/cart total
4. **Usage Tracking**: Usage count increments only on successful application
5. **Timezone**: All dates/times use server timezone (UTC)

### System Assumptions
1. **MongoDB Connection**: Assumes MongoDB is running and accessible
2. **Node.js Environment**: Assumes Node.js 14+ runtime
3. **Memory Management**: Assumes sufficient memory for in-memory calculations
4. **Network Reliability**: Assumes stable database connection
5. **Data Consistency**: Assumes single-instance deployment initially

### User Behavior Assumptions
1. **Valid Input**: API consumers provide valid product IDs and quantities
2. **Cart Persistence**: Cart state is maintained by client application
3. **Single User**: No concurrent coupon applications by same user
4. **Honest Usage**: No malicious attempts to exploit coupon logic
5. **Session Management**: Cart sessions are managed externally

## 📖 Examples

### Creating Coupons

#### Cart-wise Coupon
```json
POST /api/coupons
{
  "code": "SAVE10",
  "type": "cart-wise",
  "description": "10% off on orders above ₹500",
  "cartWiseDetails": {
    "threshold": 500,
    "discount": 10,
    "discountType": "percentage"
  },
  "maximumDiscountAmount": 100,
  "validUntil": "2024-12-31T23:59:59Z"
}
```

#### Product-wise Coupon
```json
POST /api/coupons
{
  "code": "ELECTRONICS20",
  "type": "product-wise",
  "description": "20% off on Electronics",
  "productWiseDetails": {
    "productIds": [101, 102, 103, 104],
    "discount": 20,
    "discountType": "percentage",
    "categories": ["Electronics"],
    "excludeProducts": [105]
  },
  "usageLimit": 100
}
```

#### BxGy Coupon
```json
POST /api/coupons
{
  "code": "B2G1FREE",
  "type": "bxgy",
  "description": "Buy 2 Get 1 Free",
  "bxgyDetails": {
    "buyProducts": [
      {"productId": 1, "quantity": 2},
      {"productId": 2, "quantity": 2}
    ],
    "getProducts": [
      {"productId": 3, "quantity": 1}
    ],
    "repetitionLimit": 3,
    "buyQuantityThreshold": 2
  }
}
```

### Checking Applicable Coupons
```json
POST /api/applicable-coupons
{
  "cart": {
    "items": [
      {"product_id": 1, "quantity": 3, "price": 100},
      {"product_id": 2, "quantity": 2, "price": 150},
      {"product_id": 3, "quantity": 1, "price": 200}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicable_coupons": [
      {
        "coupon_id": "60f7b1b9e1b7c123456789ab",
        "type": "cart-wise",
        "code": "SAVE10",
        "discount": 70,
        "description": "10% off on orders above ₹500"
      },
      {
        "coupon_id": "60f7b1b9e1b7c123456789cd",
        "type": "bxgy",
        "code": "B2G1FREE",
        "discount": 200,
        "description": "Buy 2 Get 1 Free"
      }
    ]
  }
}
```

### Applying a Coupon
```json
POST /api/apply-coupon/60f7b1b9e1b7c123456789ab
{
  "cart": {
    "items": [
      {"product_id": 1, "quantity": 3, "price": 100},
      {"product_id": 2, "quantity": 2, "price": 150},
      {"product_id": 3, "quantity": 1, "price": 200}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated_cart": {
      "items": [
        {
          "product_id": 1,
          "quantity": 3,
          "price": 100,
          "total_discount": 30,
          "discounted_price": 90,
          "free_quantity": 0
        },
        {
          "product_id": 2,
          "quantity": 2,
          "price": 150,
          "total_discount": 30,
          "discounted_price": 135,
          "free_quantity": 0
        },
        {
          "product_id": 3,
          "quantity": 1,
          "price": 200,
          "total_discount": 20,
          "discounted_price": 180,
          "free_quantity": 0
        }
      ],
      "total_price": 800,
      "total_discount": 80,
      "final_price": 720,
      "applied_coupon": {
        "id": "60f7b1b9e1b7c123456789ab",
        "code": "SAVE10",
        "type": "cart-wise"
      }
    }
  }
}
```



## 🔧 Configuration

### Environment Variables
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coupon_management
NODE_ENV=development
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
```

### Database Indexes
```javascript
// Recommended MongoDB indexes
db.coupons.createIndex({ "code": 1 }, { unique: true })
db.coupons.createIndex({ "type": 1 })
db.coupons.createIndex({ "isActive": 1 })
db.coupons.createIndex({ "validFrom": 1, "validUntil": 1 })
db.coupons.createIndex({ "productWiseDetails.productIds": 1 })
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/coupon_management
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 📈 Performance Considerations

1. **Database Optimization**
   - Proper indexing on frequently queried fields
   - Connection pooling for better resource management
   - Query optimization for complex coupon calculations

2. **Caching Strategy**
   - Redis for frequently accessed coupons
   - In-memory caching for static coupon rules
   - Cache invalidation on coupon updates

3. **API Optimization**
   - Request/response compression
   - Rate limiting to prevent abuse
   - Pagination for large datasets

## 🔮 Future Enhancements

1. **Microservices Architecture**: Split into separate services
2. **Event-Driven Architecture**: Use message queues for async processing
3. **Machine Learning**: Intelligent coupon recommendations
4. **Real-time Analytics**: Live coupon performance dashboards
5. **Multi-tenant Support**: Support multiple stores/brands

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
