import { combineEpics } from 'redux-observable';
import LoginEpic from './Login/login.epic';
import registerEpic from './Register/register.epic';
import AddCompanyEpic from './Account-setup/Add-company/company.epic';
import AddDepartmentEpic from './Account-setup/Add-department/department.epic';
import AddEmployeeEpic from './Account-setup/Add-employee/employee.epic';

const rootEpic = combineEpics(
  LoginEpic.login,
  registerEpic.register,
  AddCompanyEpic.addCompany,
  AddDepartmentEpic.addDepartment,
  AddEmployeeEpic.addEmployee,
  AddEmployeeEpic.employeePass,
  LoginEpic.forgotPassword,
  LoginEpic.resetPassword
);

export default rootEpic;
