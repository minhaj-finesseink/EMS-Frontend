import { combineEpics } from 'redux-observable';
import LoginEpic from './Login/login.epic';
import registerEpic from './Register/register.epic';
import AddCompanyEpic from './Add-company/company.epic';
import AddDepartmentEpic from './Add-department/department.epic';
import AddEmployeeEpic from './Add-employee/employee.epic';
import educationEpic from './Education/education.epic';
import visaEpic from './Visa/visa.epic';
import leavePolicyEpic from './LeavePolicy/leavePolicy.epic';

const rootEpic = combineEpics(
  LoginEpic.login,
  registerEpic.register,
  AddCompanyEpic.addCompany,
  AddDepartmentEpic.addDepartment,
  AddEmployeeEpic.addEmployee,
  AddEmployeeEpic.employeePass,
  AddEmployeeEpic.getUserById,
  AddEmployeeEpic.userUpdate,
  LoginEpic.forgotPassword,
  LoginEpic.resetPassword,
  educationEpic.addEducation,
  educationEpic.getEducation,
  visaEpic.addVisa,
  visaEpic.getVisa,
  leavePolicyEpic.addLeavePolicy,
  leavePolicyEpic.getLeavePolicy,
);

export default rootEpic;
