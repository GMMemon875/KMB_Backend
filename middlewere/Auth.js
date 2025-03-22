// DASHBOARD ADMIN ATHANTICATION AND AUTHORAIETION
import { catchAsyncErrors } from "./CatchAsynicError.js";
import ErrorHandler from "./errorMiddlewere.js";
import jwt from "jsonwebtoken";
import { User } from "../modals/userSchema.js";

export const isAdminAthantication = catchAsyncErrors(
  // is middlewere function men hm check kar rahee hn ke admin user ke pass AdminToken cookies he
  async (req, res, next) => {
    const token = req.cookies.AdminToken;
    if (!token) {
      // cookies nhe he to
      return next(
        new ErrorHandler("Dashboard User is not authenticated!", 400) // ErrorHandler men ye code code chaluo
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // agr Token he to us ko verify karoo ke .env men jo secret key he us se match karoo ke secret key match kar rahee hn
    req.user = await User.findById(decoded.id); // req.user men user.id find karoo ke decoded variabel.id ko
    if (req.user.role !== "Admin") {
      // our check karoo ke jo user aya he us ka role Admin nhe he
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`,
          403
        ) // to ye code chalauo
      );
    }
    next(); // middlewere next()
  }
);

export const isPateintAthantication = catchAsyncErrors(
  async (req, res, next) => {
    // is middlewere function men hm check kar rahee hn ke patient user ke pass patientToken cookies he
    const token = req.cookies.patientToken;
    if (!token) {
      // cookies nhe he to
      return next(new ErrorHandler("Your are Not Athanticated", 400)); // ErrorHandler men ye code code chaluo
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // agr Token he to us ko verify karoo ke .env men jo secret key he us se match karoo ke secret key match kar rahee hn
    req.user = await User.findById(decoded.id); // req.user men user.id find karoo ke decoded variabel.id ko

    if (req.user.role !== "Patient") {
      // our check karoo ke jo user aya he us ka role patient nhe he
      return next(
        new ErrorHandler(
          `${req.user.role}not Authorized for this resourse`,
          400
        ) // to ye code chalauo
      );
    }
    next(); //middlewere next()  call to function
  }
);
