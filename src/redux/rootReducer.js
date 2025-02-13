import { combineReducers } from 'redux';
import authReducer from './Auth/auth.reducer';
import addCompanyReducer from './Add-company/company.reducer';
import addDepartmentReducer from './Add-department/department.reducer';
import educationReducer from './Education/education.reducer';
import visaReducer from './Visa/visa.reducer';
import generalTimeOffReducer from './GeneralTimeOff/generalTimeOff.reducer';
import userReducer from './User/user.reducer'
import userTimeOffReducer from './UserTimeOff/userTimeOff.reducer';
import shiftReducer from './ShiftAPIs/Shift/shift.reducer';
import videoConferenceReducer from './VideoConference/video.reducer';

const rootReducer = combineReducers({
  login: authReducer,
  company: addCompanyReducer,
  department: addDepartmentReducer,
  user: userReducer,
  education: educationReducer,
  visa: visaReducer,
  generalTimeOff: generalTimeOffReducer,
  userTimeOff: userTimeOffReducer,
  shift: shiftReducer,
  videoConference: videoConferenceReducer
});

export default rootReducer;
