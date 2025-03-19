export const genrateToken = (user, message, statusCode, res) => {
  // UserController se jo user create hoa (user,message,statusCode,res) is 3 properties ke sath to us ka token genrate karoo

  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "AdminToken" : "patientToken"; // token create karni se pahly ye cheack karoo ke role kon sa he Agr Admin he (?) to AdminToken create karoo ():) warna patientToen
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      // us ke bad res.status men men statusCode ko it men HTTP code 200,2001 our jo cookies he our cookiesName he patient ke our admin ke role ke hesa he adjast hoga
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 //.env se cookies Expire days decide keya he gaya he our (7 * 24 * 60 * 60 * 1000)is ka matlab hai 1 din ko milliseconds mein convert karna.
      ),
      httpOnly: true, //     httpOnly: true  => ka matlab hai cookie sirf HTTP requests ke through access hogi, JavaScript se nahi (security purpose).
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
//  Final response send kiya ja raha hai jo client ko milega.
//  Response mein:

// success: true → Response successful hai.
// message → Function call ke saath jo message pass kiya gaya tha.
// user → Jo user create/update hua hai.
// token → JWT token jo authentication ke liye diya gaya hai.
