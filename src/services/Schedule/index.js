import * as Canons from '../../../data'
const NUMBER_OF_DAYS = 30


export default class ScheduleService {
  static getTotalTime = (books = []) => {
    return parseFloat(Object.keys(books).reduce((acc, curr) => {
      return acc + books[curr]
    }, 0))
  }

  static formatScriptures = (scripture) => {
    const scriptures = []
    Object.keys(Canons[scripture]).map((k, i, arr) => {
        scriptures.push({ name: k, time: Canons[scripture][k] })
    })
    return scriptures
  }

  static generateSchedule = (totalDays = NUMBER_OF_DAYS, books = []) => {
    const scriptures = []
    books.map(book => {
      scriptures.push(...ScheduleService.formatScriptures(book))
    })
    // console.log(scriptures)
    const TOTAL_TIME = ScheduleService.getTotalTime(scriptures)
    const AVG_TIME_PER_DAY = parseFloat(TOTAL_TIME) / totalDays
    let lastIndex = 0
    // const mean = scriptures.reduce((acc, curr) => acc + curr.time, 0) / totalDays
    // console.log(mean)
    const initMean = scriptures.reduce((acc, curr) => acc + curr.time, 0) / (totalDays)
    runningAverage = (newScripts, mean = initMean, rev = false) => {
      const schedule = []
      const scriptsClone = Object.assign([], newScripts)
      let day = 1
      let chaptersRemaining = 0
      for (; day <= totalDays; day++) {
        let runningTime = 0
        let lastIndex = 0
        let assignment = []
        if (!scriptsClone || scriptsClone.length === 0) {
          break
        }
        while (runningTime < mean) {
          let nextChapter = scriptsClone.splice(0, 1)
          assignment.push(...nextChapter)
          if (!nextChapter[0]) {
            break
          }
          runningTime += nextChapter[0].time
        }
        if (day === totalDays && (scriptsClone && scriptsClone.length > 0)) {
          chaptersRemaining = scriptsClone.length
        }
        schedule.push(assignment)
      }
      if (rev) {
        return schedule
      }
      const diff = totalDays - day
      if (diff > 0) {
        return runningAverage(newScripts, mean - 0.05)
      }
      if (diff < 0) {
        return runningAverage(newScripts, mean + 0.05, true)
      }
      console.log(diff)
      return schedule
    }
    const schedule = runningAverage(Object.assign([], scriptures))
    console.log(schedule.length)
    return schedule
  }
}
