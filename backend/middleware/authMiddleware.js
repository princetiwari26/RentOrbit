// const jwt = require("jsonwebtoken");
// const Tenant = require("../models/Tenant");

// const protect = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.tenant = await Tenant.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Unauthorized, token failed" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }
// };
// const authorize = (...allowedTypes) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       res.status(401);
//       throw new Error('Not authorized, user not found');
//     }

//     if (!allowedTypes.includes(req.user.userType)) {
//       res.status(403);
//       throw new Error(`User type ${req.user.userType} is not authorized to access this route`);
//     }
//     next();
//   };
// };

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack
//   });
// };

// const notFound = (req, res, next) => {
//   const error = new Error(`Not found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

// // module.exports = { errorHandler, notFound };

// module.exports = { protect, authorize, errorHandler, notFound };











// const jwt = require('jsonwebtoken');
// const Tenant = require('../models/Tenant');
// const Landlord = require('../models/Landlord');
// const asyncHandler = require('express-async-handler');

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Check for token in authorization header
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];
      
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Check both Tenant and Landlord models
//       let user = await Tenant.findById(decoded.id).select('-password');
      
//       if (!user) {
//         user = await Landlord.findById(decoded.id).select('-password');
//       }

//       if (!user) {
//         res.status(401);
//         throw new Error('User not found');
//       }

//       // Attach the appropriate user type to the request
//       if (user instanceof Tenant) {
//         req.tenant = user;
//         req.userType = 'tenant';
//       } else if (user instanceof Landlord) {
//         req.landlord = user;
//         req.userType = 'landlord';
//       }

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// // Authorization middleware for specific user types
// const authorize = (...allowedTypes) => {
//   return (req, res, next) => {
//     if (!req.userType) {
//       res.status(401);
//       throw new Error('Not authorized');
//     }

//     if (!allowedTypes.includes(req.userType)) {
//       res.status(403);
//       throw new Error(`User type ${req.userType} is not authorized`);
//     }
//     next();
//   };
// };

// module.exports = { protect, authorize };



const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        userType: decoded.userType
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = protect;