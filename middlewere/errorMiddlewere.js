 class ErrorHandler extends Error {                  //Yeh code ek custom error handler class hai jo JavaScript ke Error class ko extend karke banayi gayi hai. Custom error handlers ka use isliye hota hai taake hum apne specific error messages aur status codes handle kar saken, jo development (specially backend development) mein kaafi helpful hota hai. Chaliye step by step samajhte hain:
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Default values for error message and status code
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle duplicate key error (MongoDB)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue || {})} Entered`;    // 11000 ye error data base se ate he ke same value ager ham enter karte hen to ate he for example ek ie email agr same email se 2 accout create honge to ye error run hoga  
    err = new ErrorHandler(message, 400);
  }

  // Handle invalid JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, Try again!";  // ye Error tab ate he ke ek banda Bina acoount create karni ke bajaie inter hota he us ke pass JWT Token nhe hota he  
    err = new ErrorHandler(message, 400);
  }

  // Handle expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is expired, Try again!"; // ye error tab chale ga jab tak ke us user ketni din tak us ke token Expire hoga 
    err = new ErrorHandler(message, 400);
  }

  // Handle Mongoose CastError (invalid ID or similar)
  if (err.name === "CastError") {                     // ye error tab chale gi ke CastError ka mtlb loue user apni data kochange lekhe forExample us ni number ke jhaga per name lekha email ke jagha per number lekha ye CastError tab chale ge  
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle validation errors (optional improvement)
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(", ")
    : err.message;

  // Send the error response
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
