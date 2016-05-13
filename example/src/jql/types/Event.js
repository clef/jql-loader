/* Event
 *
 * A class that represents a JQL event in Mixpanel.
 *
 */
class Event {
  constructor (name, properties = {}) {
    if (typeof name === 'object') {
      properties = name
    }
    this.event = name
    this.selector = properties.selector
  }
}

export default Event
