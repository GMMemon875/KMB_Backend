import { catchAsyncErrors } from "../middlewere/CatchAsynicError.js";
import ErrorHandler from "../middlewere/errorMiddlewere.js";
import { User } from "../modals/userSchema.js";
import { genrateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  // is middlewere function men jo be data fill hoge wo aie ge
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    role,
    password,
  } = req.body; // get all input feilds
  if (
    // ke agr is men se koie be field missing hoie to
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !role ||
    !password
  ) {
    return next(new ErrorHandler("please fill full form", 400));
  }

  let user = await User.findOne({ email });
  // agr koie sare data ko fil karta he to email chaeck karengi ke is email se koie our register to nhe he user.findOne karega email
  if (user) {
    // agr koie email already he to us ko neche wala code send karo do
    return await next(new ErrorHandler("User Already Register"));
  }
  user = await User.create({
    // agr eamil nhe he to us ka acoount .create se create karoo us men neche wale sare field add karoo
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    role,
    password,
  });
  genrateToken(user, "user Register successfully", 200, res); // fiels input hone ke bad ye msg send karoo
});

export const Login = catchAsyncErrors(async (req, res, next) => {
  //login middlewere function
  const { email, password, confirmPassword, role } = req.body; // input felids
  if (!email || !password || !confirmPassword || !role) {
    // agr sare filds koie fill nhe karta to
    return next(new ErrorHandler("please provide all datails", 400)); // ye msg show karoo
  }
  if (password !== confirmPassword) {
    // ke agr password our confirm password match nhe karte hen
    return next(
      // next ye code chalauo
      new ErrorHandler("Password and confirmPassword is not match", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password"); // user men se email find ho rahee he ke jo email input hoie he wo already mangoose men he .slect +(password) Jab aap Mongoose model schema define karte hain, agar aap password field ko select: false rakhein to yeh field by default database se fetch nahi hoti.
  if (!user) {
    return next(new ErrorHandler("Email or Password Incorrect", 400)); // user nhe he to
  }
  const isPasswordMatch = await user.comparePassword(password); // agr user.comparePassword or password match nhe hota he to
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password and Email is not Match", 400));
  }
  if (role !== user.role) {
    // jo role he wo match nhe hota he to
    return next(new ErrorHandler("User with this role is not Found"));
  }
  genrateToken(user, "user Login successfully", 200, res); // agr uper wale condition sab sahe he to us ka Token be ganrate karoo our user login sucessfuly karoo
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} With This Email Already Exists!`,
        400
      )
    );
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const getAllDoctores = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDatils = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const AdminLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("AdminToken", " ", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin user LogOut Successfully",
    });
});

export const patientLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", " ", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: " Patient user LogOut Successfully",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);

  // console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});
