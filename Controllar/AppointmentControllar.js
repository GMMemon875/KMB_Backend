import { catchAsyncErrors } from "../middlewere/CatchAsynicError.js";
import ErrorHandler from "../middlewere/errorMiddlewere.js";
import { Appointment } from "../modals/appointmentSchema.js";
import { User } from "../modals/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  // Postappointment middlewere function
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body; // Appointment Post karni ke lei ye sare filds input karnen wo req,body men aa jaie gen

  if (
    // koie be fild missing hoie
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("please fill full form! ", 400)); // koie be fild missing hoie to ye error thero karoo
  }

  // ke agr koie doctore ko find karna dataBase se unique name

  const isConflict = await User.find({
    firstName: doctor_firstName, // same doctor
    lastName: doctor_lastName, // us ka last name
    role: "Doctor", // us ka role Doctor he
    doctorDepartment: department, // us ka department same he jo tm ni frontend se bejha he
  });
  // console.log(isConflict, doctor_firstName, doctor_lastName, department);
  if (isConflict.length === 0) {
    // ke agr is Conflict.length men koie data nhe he === 0 he
    return next(new ErrorHandler("Doctor Not Found!", 400)); // to ye code chalauo
  }
  if (isConflict.length > 1) {
    // ke agr isConlit.length > 1 it men doctor he
    return next(
      // retrun ye karoo
      new ErrorHandler(
        "Doctore Conflict! so Please Contact To hostpital Management and Get Appointment",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id; // uper isConflict men doctore save ho gaya he is waja se yahe ie doctor ke id Get kar le
  const patientId = req.user._id; // zahere bat he patient Athurized hoga tab he Appointment lega na to bs login patient ke Id Get ke he

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    message: "Appointment sent Successfully",
    appointment,
  });
});

export const getAllAppointment = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

//Update function pahly jo user login he us ke id ko read karega params our find kare ga Id ke sath ke us ke koie Appointmen register he

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    console.log(req.params);
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment is Not Found!", 400));
    }
    // us ke badke agr appointment register he to us ke  findByIdAndUpdate() methard se us ke sare Appointment ko update karega req.body men jo be data aie ge us ko chahe wo user ke apni data Q na ho wo be update kar sakta he is lei hm srif Appointment ke updation frontend se karengi
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true, // new data ko Update karoo True
      runValidators: true, // jo validetor he us ko true karoo
      useFindAndModify: false, // modifyle flase abhe ke lei
    });
    res.status(200).json({
      success: true,
      message: "Appointment Update SuccessFully",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Is Not Found!", 400));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Delete Successfully",
  });
});
