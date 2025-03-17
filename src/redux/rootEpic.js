import { combineEpics } from 'redux-observable';
import AuthEpic from './Auth/auth.epic';
import AddCompanyEpic from './Add-company/company.epic';
import AddDepartmentEpic from './Add-department/department.epic';
import educationEpic from './Education/education.epic';
import visaEpic from './Visa/visa.epic';
import generalTimeOffEpic from './GeneralTimeOff/generalTimeOff.epic';
import UserEpic from './User/user.epic';
import userTimeOffEpic from './UserTimeOff/userTimeOff.epic';
import ShiftEpic from './ShiftAPIs/Shift/shift.epic';
import VideoConferenceEpic from './VideoConference/video.epic';

const rootEpic = combineEpics(
  AuthEpic.login,
  AuthEpic.forgotPassword,
  AuthEpic.resetPassword,
  AuthEpic.createVerificationCode,
  AuthEpic.verifyCode,
  AuthEpic.signUp,
  AddCompanyEpic.addCompany,
  AddDepartmentEpic.addDepartment,
  AddDepartmentEpic.getDepartment,
  UserEpic.addUser,
  UserEpic.userPass,
  UserEpic.getUserById,
  UserEpic.userUpdate,
  UserEpic.getUserByCompanyId,
  educationEpic.addEducation,
  educationEpic.getEducation,
  visaEpic.addVisa,
  visaEpic.getVisa,
  generalTimeOffEpic.addGeneralTimeOff,
  generalTimeOffEpic.getGeneralTimeOff,
  userTimeOffEpic.addUserTimeOff,
  ShiftEpic.addShift,
  ShiftEpic.getAllShift,
  ShiftEpic.deleteShiftById,
  ShiftEpic.updateShiftById,
  ShiftEpic.getUserByUsitiveHr,
  ShiftEpic.addShiftBulkUser,
  ShiftEpic.addShiftUserFromHr,
  VideoConferenceEpic.startInstantMeeting,
  VideoConferenceEpic.sendMeetingInvite,
  VideoConferenceEpic.joinMeeting,
  VideoConferenceEpic.updateHostControl
);

export default rootEpic;
