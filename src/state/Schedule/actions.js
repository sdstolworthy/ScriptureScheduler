import ScheduleService from "../../services/Schedule/index";
import { AsyncStorage } from "react-native";
import base64 from 'base-64'
import uuidv4 from 'uuid/v4'

export const SET_ENTRY_AS_COMPLETE = '[Schedule] Entry marked as complete'

export const SET_SCHEDULE = '[Schedule] Set Schedule'

export const GENERATE_SCHEDULE = '[Schedule] Generate Schedule'

export const SET_AVAILABLE_SCHEDULES = '[Schedule] Set available schedules'

export function toggleAssignment (entryId) {
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

export function markAsComplete (assignmentId, scheduleId) {
  return (dispatch) => {
    AsyncStorage.getItem('Schedules').then((encoded) => {
      const schedules = JSON.parse(base64.decode(encoded))
      const scheduleIdx = schedules.findIndex(v => v.id === scheduleId)
      schedules[scheduleIdx].assignment[schedules[scheduleIdx].assignment.findIndex(v => v.id === assignmentId)]
      const asstIdx = schedules[scheduleIdx].assignment.findIndex(v => v.id === assignmentId)
      const isComplete = schedules[scheduleIdx].assignment[asstIdx].complete
      schedules[scheduleIdx].assignment[asstIdx].complete = !isComplete
      const reencoded = base64.encode(JSON.stringify(schedules))
      AsyncStorage.setItem('Schedules', reencoded).then(() => {
        dispatch(toggleAssignment(assignmentId))
      })
    })
  }
}

export function loadSchedule (scheduleId = null) {
  return (dispatch) => {
    try {
      AsyncStorage.getItem('Schedules').then((schedules) => {
        let decoded
        if (schedules) {
          decoded = JSON.parse(base64.decode(schedules) || '[]') || []
        } else {
          decoded = []
        }
        const availSchedules = decoded.map(formatAvailableSchedules)
        dispatch(setAvailableSchedules(availSchedules))
        if (!decoded || decoded.length === 0) {
          throw TypeError('array is null')
        }
        if (scheduleId) {
          const foundSched = decoded.findIndex(v => {
            return v.id === scheduleId
          })
          if (foundSched) {
            return dispatch(setSchedule(foundSched))
          }
        }
        return dispatch(setSchedule(decoded[decoded.length - 1] || []))
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
        if (currentSchedules) {
          currentSchedules = JSON.parse(base64.decode(currentSchedules))
        }
        if (!Array.isArray(currentSchedules)) {
          currentSchedules = []
        }
        if (!scheduleName) {
          scheduleName = 'Schedule ' + (currentSchedules && currentSchedules.length + 1) || 0
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