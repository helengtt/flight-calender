/* Calendar App source url: https://github.com/fullcalendar/fullcalendar-example-projects/tree/master/react */
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import './main.scss'

export default class App extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    flights: [],
    reults: [],
    calendarWeekends: true,
    calendarEvents: [],// initial event data
  }

  render() {
    const optionList = this.state.flights.map((flight, index) => 
      <option key={index+1} value={flight}>{flight}</option>
    );
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>       
          <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
          <button onClick={ this.gotoPast }>go to a date in the past</button>&nbsp;
          <label>Flights:
            <select onChange={this.valueChange}>
              <option key='0' value=''></option>
              {optionList}
            </select>
          </label>
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
  componentDidMount = () => {
    fetch('https://us-central1-sto-planner.cloudfunctions.net/api/flights')
    .then(res => res.json())
    .then(
      (res) => {
        this.setState({
          flights: res,
        });
      },
      (err) => {
        return `Error: ${err.message}`
      }
    )
  }

  valueChange = (event) => {
    this.setState({value: event.target.value});
    this.flightInfo(event.target.value);
  }

  flightInfo = (value) => {
    fetch(`https://us-central1-sto-planner.cloudfunctions.net/api/flights/${value}`)
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
      for (let obj of value['load']) {
        let classinfo = `${obj['seatsForSale']} for sale, ${obj['seatsAvailable']} available`;
        let eventcolor = function() {
          if (obj['cabinClassDescription'] === "Business")
            return "green";
          if (obj['cabinClassDescription'] === "Economy")
            return "purple";
          if (obj['cabinClassDescription'] === "Premium Economy")
            return "pink";           
        }
        eventsResult.push({title: classinfo, date: key, color: eventcolor()})
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
