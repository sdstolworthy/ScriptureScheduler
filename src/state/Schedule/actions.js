export const SET_ENTRY_AS_COMPLETE = '[Schedule] Entry marked as complete'

export function markAsComplete (entryId) {
  return {
    type: SET_ENTRY_AS_COMPLETE,
    payload: entryId
  }
}

