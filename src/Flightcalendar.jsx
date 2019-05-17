/* Calendar App source url: https://github.com/fullcalendar/fullcalendar-example-projects/tree/master/react */
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import './main.scss'

class Flightcalendar extends React.Component {
  constructor (props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  calendarComponentRef = React.createRef()
  state = {
    // flights: [],
    calendarWeekends: true,
    calendarEvents: [],// initial event data
  }

  render() {
    // const optionList = this.state.flights.map((flight, index) => 
    //   <option key={index+1} value={flight}>{flight}</option>
    // );
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>       
          <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
          <button onClick={ this.gotoPast }>go to a date in the past</button>&nbsp;
          {/* add flights selection */}
          {/* <label>Flights:
            <select onChange={this.valueChange}>
              <option key='0' value=''></option>
              {optionList}
            </select>&nbsp;&nbsp;
          </label> */}
          <label className='color-cabinclass'>
            <span style={{background:'green', color:'white'}}>Business</span>&nbsp;
            <span style={{background:'purple', color:'white'}}>Economy</span>&nbsp;
            <span style={{background:'pink', color:'white'}}>Premium Economy</span>&nbsp;
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

  // get the cabin info by flight
  // flightInfo = (value) => {
  componentDidMount = () => {
    fetch(`https://us-central1-sto-planner.cloudfunctions.net/api/flights/${this.props.match.params.id}`)
    .then(res => res.json())
    .then(
      (results) => {
        this.setState({
          calendarEvents: this.calendarEvents(results),
        });
      },
      (error) => {
        return `Error: ${error.message}`
      }
    )
  }

 // Insert daily cabin info by cabinClass to calendar   
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

export default Flightcalendar
