import { combineReducers } from 'redux';
import loginReducer from './Login/login.reducer';
import registerReducer from './Register/register.reducer';
import addCompanyReducer from './Account-setup/Add-company/company.reducer';
import addDepartmentReducer from './Account-setup/Add-department/department.reducer';
import addEmployeeReducer from './Account-setup/Add-employee/employee.reducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  addCompany: addCompanyReducer,
  addDepartment: addDepartmentReducer,
  addEmployee: addEmployeeReducer
});

export default rootReducer;
