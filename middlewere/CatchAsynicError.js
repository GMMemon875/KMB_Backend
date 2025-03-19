
// Middleware function to handle asynchronous errors
// It wraps an async function and ensures any errors are caught and passed to the next middleware

export const catchAsyncErrors = (theFuction) =>{
    return (req,res,next) =>{
        // Resolve the passed function (async function)
        // If it throws an error, it will be caught and passed to the next middleware
      Promise.resolve(theFuction(req,res,next)).catch(next);
    };
}


// explain  
//Kaisa Kaam Karta Hai:

// Aapka asynchronous function theFunction ko Promise.resolve() mein wrap kiya gaya hai.
// Agar function ke andar koi error aaye, to woh .catch(next) ke through next error-handling middleware ko pass ho jata hai.