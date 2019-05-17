import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Flightcalendar from './Flightcalendar'
import './main.scss'

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path="/" component={Flightslist} />
                <Route path="/:id" component={Flightcalendar} />                
            </Router>         
        )
    }    
}

class Flightslist extends React.Component {
    state = {
        flights: [],
    }
    render() {
        const flightsList = this.state.flights.map((flight, index) => 
            <li key={index} value={flight}>
                <Link to={`/${flight}`}>{flight}</Link>
            </li>
        );
        return (
            <div>
                <h1>Flights:</h1>
                <ul>
                    {flightsList}
                </ul>
            </div>
        )
    }

    // get flights in json format, set state
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

    // get the flight selected
    valueChange = (event) => {
        this.setState({value: event.target.value});

    }

}

export default App