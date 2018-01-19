import ScheduleService from "../../services/Schedule/index";
import { AsyncStorage } from "react-native";
import base64 from 'base-64'
export const SET_ENTRY_AS_COMPLETE = '[Schedule] Entry marked as complete'

export const SET_SCHEDULE = '[Schedule] Set Schedule'

export const GENERATE_SCHEDULE = '[Schedule] Generate Schedule'

export function markAsComplete (entryId) {
  return {
    type: SET_ENTRY_AS_COMPLETE,
    payload: entryId
  }
}

export function setSchedule (schedule) {
  return {
    type: SET_SCHEDULE,
    payload: schedule
  }
}

export function loadSchedule () {
  return (dispatch) => {
    try {
      AsyncStorage.getItem('@Schedule').then(schedule => {
        const decoded = JSON.parse(base64.decode(schedule))
        dispatch(setSchedule(decoded))
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export function genSchedule (days = 10, books = []) {
  return (dispatch) => {
    const schedule = ScheduleService.generateSchedule(days, books)
    const encoded = base64.encode(JSON.stringify(schedule))
    try {
      AsyncStorage.setItem('@Schedule', encoded).then()
    } catch (error) {
      console.warn(error)
    }
    dispatch(setSchedule(schedule))
  }
}