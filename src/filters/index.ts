import moment from 'moment'

/**
 * 时间转化
 *
 * @export
 * @param {Date} time
 * @param {string} format
 * @returns {string}
 */
export function format (time: Date, format: string): string {
  const date = new Date(time)
  return moment(date).format(format)
}
