import * as ScheduleActions from './actions'

const initialState = {
  entries: [],
  loading: false,
}

export default function schedule (state = initialState, {type, payload}) {
  switch (type) {
    case ScheduleActions.SET_SCHEDULE:
      return {
        ...state,
        entries: payload
      }
    default:
      return state
  }
}