import { Message } from "../modals/massageSchema.js";
import { catchAsyncErrors } from "../middlewere/CatchAsynicError.js";
import ErrorHandler from "../middlewere/errorMiddlewere.js";

export const Sendmassage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("please fill full Form", 400));
  }
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(201).json({
    success: true,
    message: "Send Message successfully",
  });
});
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const Messages = await Message.find();
  res.status(200).json({
    success: true,
    Messages,
  });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const message = await Message.findByIdAndDelete(id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});
