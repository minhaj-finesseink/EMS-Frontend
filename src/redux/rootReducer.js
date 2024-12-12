import { combineReducers } from 'redux';
import loginReducer from './Login/login.reducer';
import registerReducer from './Register/register.reducer';
import addCompanyReducer from './Add-company/company.reducer';
import addDepartmentReducer from './Add-department/department.reducer';
import addEmployeeReducer from './Add-employee/employee.reducer';
import educationReducer from './Education/education.reducer';
import visaReducer from './Visa/visa.reducer';
import leavePolicyReducer from './LeavePolicy/leavePolicy.reducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  addCompany: addCompanyReducer,
  addDepartment: addDepartmentReducer,
  addEmployee: addEmployeeReducer,
  education: educationReducer,
  visa: visaReducer,
  leavePolicy: leavePolicyReducer
});

export default rootReducer;
