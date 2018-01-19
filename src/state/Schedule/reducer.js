import * as ScheduleActions from './actions'

const initialState = {
  entries: {},
  availableSchedules: [],
  loading: false,
}

export default function schedule (state = initialState, {type, payload}) {
  const newState = Object.assign({}, state)
  switch (type) {
    case ScheduleActions.SET_SCHEDULE:
      return {
        ...newState,
        entries: payload
      }
    case ScheduleActions.SET_AVAILABLE_SCHEDULES:
      return {
        ...newState,
        availableSchedules: payload
      }
    case ScheduleActions.SET_ENTRY_AS_COMPLETE:
      const compAssign = newState.entries.assignment.find(v => v.id === payload)
      compAssign.complete = !compAssign.complete
      return {
        ...newState,
        entries: {
          ...newState.entries,
          compAssign
        }
      }
    default:
      return state
  }
}