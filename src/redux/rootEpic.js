import { combineEpics } from 'redux-observable';
import LoginEpic from './Login/login.epic';
import registerEpic from './Register/register.epic';
import AddCompanyEpic from './Add-company/company.epic';
import AddDepartmentEpic from './Add-department/department.epic';
import educationEpic from './Education/education.epic';
import visaEpic from './Visa/visa.epic';
import generalTimeOffEpic from './GeneralTimeOff/generalTimeOff.epic';
import UserEpic from './User/user.epic';
import userTimeOffEpic from './UserTimeOff/userTimeOff.epic';

const rootEpic = combineEpics(
  LoginEpic.login,
  registerEpic.register,
  AddCompanyEpic.addCompany,
  AddDepartmentEpic.addDepartment,
  AddDepartmentEpic.getDepartment,
  UserEpic.addUser,
  UserEpic.userPass,
  UserEpic.getUserById,
  UserEpic.userUpdate,
  LoginEpic.forgotPassword,
  LoginEpic.resetPassword,
  educationEpic.addEducation,
  educationEpic.getEducation,
  visaEpic.addVisa,
  visaEpic.getVisa,
  generalTimeOffEpic.addGeneralTimeOff,
  generalTimeOffEpic.getGeneralTimeOff,
  userTimeOffEpic.addUserTimeOff,
);

export default rootEpic;
