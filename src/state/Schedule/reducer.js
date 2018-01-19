import * as ScheduleActions from './actions'

const initialState = {
  entries: [],
  availableSchedules: [],
  loading: false,
}

export default function schedule (state = initialState, {type, payload}) {
  switch (type) {
    case ScheduleActions.SET_SCHEDULE:
      return {
        ...state,
        entries: payload
      }
    case ScheduleActions.SET_AVAILABLE_SCHEDULES:
      return {
        ...state,
        availableSchedules: payload
      }
    default:
      return state
  }
}