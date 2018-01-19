import ScheduleService from "../../services/Schedule/index";
import { AsyncStorage } from "react-native";
import base64 from 'base-64'
import uuidv4 from 'uuid/v4'

export const SET_ENTRY_AS_COMPLETE = '[Schedule] Entry marked as complete'

export const SET_SCHEDULE = '[Schedule] Set Schedule'

export const GENERATE_SCHEDULE = '[Schedule] Generate Schedule'

export const SET_AVAILABLE_SCHEDULES = '[Schedule] Set available schedules'

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

export function setAvailableSchedules (availableSchedules) {
  return {
    type: SET_AVAILABLE_SCHEDULES,
    payload: availableSchedules
  }
}


export function loadSchedule (scheduleId = null) {
  return (dispatch) => {
    try {
      AsyncStorage.getItem('lastSchedule').then((last) => {
        AsyncStorage.getItem('Schedules').then((schedules) => {
          const decoded = JSON.parse(base64.decode(schedules))
          const availSchedules = decoded.map(formatAvailableSchedules)
          dispatch(setAvailableSchedules(availSchedules))
          if (!decoded || decoded.length === 0) {
            throw TypeError('array is null')
          }
          if (scheduleId) {
            const foundSched = decoded.find(v => {
              return v.id === scheduleId
            })
            if (foundSched) {
              foundSched.assignment = foundSched.assignment.map(checkIdsExist)
              return dispatch(setSchedule(foundSched))
            }
          }
          let workingArray = decoded[decoded.length - 1].assignment || []
          workingArray = workingArray.map(checkIdsExist)
          decoded[decoded.length - 1].assignment = workingArray
          return dispatch(setSchedule(decoded[decoded.length - 1] || []))
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export function genSchedule (days = 10, books = [], scheduleName = null) {
  return (dispatch) => {
    const schedule = ScheduleService.generateSchedule(days, books)
    try {
      AsyncStorage.getItem('Schedules').then(currentSchedules => {
        currentSchedules = JSON.parse(base64.decode(currentSchedules))
        if (!scheduleName) {
          scheduleName = 'Schedule ' + (currentSchedules && currentSchedules.length + 1) || 0
        }
        if (!Array.isArray(currentSchedules)) {
          currentSchedules = []
        }
        const assignment = {
          name: scheduleName,
          id: currentSchedules && currentSchedules.length + 1 || 0,
          assignment: schedule
        }
        currentSchedules.push(assignment)
        const encoded = base64.encode(JSON.stringify(currentSchedules))
        const availSchedules = currentSchedules.map(formatAvailableSchedules)
        dispatch(setAvailableSchedules(availSchedules))
        AsyncStorage.setItem('Schedules', encoded).then(() => {
          dispatch(setSchedule(assignment))
        })
      })
    } catch (error) {
      console.warn(error)
    }
  }
}

function formatAvailableSchedules (value, index) {
  return {
    name: value.name,
    value: value.id,
    totalDays: value.assignment.length,
    daysRemaining: value.assignment.filter(v => !v.complete).length
  }
}

function checkIdsExist (value, index) {
  if (Array.isArray(value)) {
    const newVal = {
      reading: value,
      id: uuidv4()
    }
    return newVal
  }
}