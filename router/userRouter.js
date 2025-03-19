import express from "express"
import {  addNewAdmin, getAllDoctores, Login, patientRegister,getUserDatils, AdminLogout, patientLogout, addNewDoctor, } from "../Controllar/UserController.js"
import {isAdminAthantication,isPateintAthantication} from "../middlewere/Auth.js"


const router = express.Router()

router.post("/patient/register",patientRegister)
router.post("/login",Login)
router.post("/admin/addnew",isAdminAthantication,addNewAdmin)
router.get("/doctors", getAllDoctores)
router.get("/admin/me", isAdminAthantication, getUserDatils )
router.get("/patient/me", isPateintAthantication, getUserDatils )
router.get("/admin/logout", isAdminAthantication, AdminLogout )
router.get("/patient/logout", isPateintAthantication, patientLogout )
router.post("/doctor/addnew", isAdminAthantication, addNewDoctor )

export default router