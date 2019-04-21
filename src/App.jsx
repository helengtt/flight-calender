/* Calendar App source url: https://fullcalendar.io/ */
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import './main.scss'

export default class App extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    reults: [],
    calendarWeekends: true,
    calendarEvents: []// initial event data
  }

  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>
          <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
          <button onClick={ this.gotoPast }>go to a date in the past</button>&nbsp;
          {/* (also, click a date/time to add an event) */}
        </div>
        <div className='demo-app-calendar'>
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            ref={ this.calendarComponentRef }
            weekends={ this.state.calendarWeekends }
            events={ this.state.calendarEvents }
            // dateClick={ this.handleDateClick }
            />
        </div>
      </div>
    )
  }

  // get flight data in json format, set state
  componentDidMount () {
    // fetch('https://dl2.pushbulletusercontent.com/ZB5kmmAZAC8IcvN6MM9ysGQvoLays1PY/load_list.json', { mode: 'no-cors'})
    fetch('http://127.0.0.1:5500/flights_list.json')
      .then(res => res.json())
      .then(
          (results) => {
            this.setState({
              results: results,
              calendarEvents: this.calendarEvents(results),
            });
          },
        (error) => {
          return `Error: ${error.message}`
        }
      )  
  }

  calendarEvents = (results) => {
    let eventsResult = [];
    for (let key in results) {
      let value = results[key];
      for (let obj of value) {
        eventsResult.push({title: `${obj['cabinClassDescription']}: ${obj['seatsAvailable']} available, ${obj['seatsForSale']} for sale`, date: key})
      }
    }
    return eventsResult
  }

  toggleWeekends = () => {
    this.setState({ // update a property
      calendarWeekends: !this.state.calendarWeekends
    })
  }

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi()
    calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  }

  // handleDateClick = (arg) => {
  //   if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
  //     this.setState({  // add new event data
  //       calendarEvents: this.state.calendarEvents.concat({ // creates a new array
  //         title: 'New Event',
  //         start: arg.date,
  //         allDay: arg.allDay
  //       })
  //     })
  //   }
  // }

}
