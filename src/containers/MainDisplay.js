import React from 'react';
import MapDoc from '../components/MapDoc';
import Search from '../components/Search';
import EventDisplay from '../components/EventDisplay'
import '../index.css'
import { Dimmer, Loader } from 'semantic-ui-react'


const BASE_URL="http://localhost:3001/search?"

class MainDisplay extends React.Component {
    constructor() {
        super()
        this.state = {
            events: [],
            long: null,
            lat: null,
            selectedEvent: null,
            popupEvent: null,
            loading: true
        }
    }

    componentDidMount() {
        console.log("maindisplay mounted")
        this.getUserLocationAndFetchEvents()
    }

    fetchInitialEvents = (lat, long) => {
        //returns a promise that holds the results of our API call to MEETUP
        return fetch(`${BASE_URL}lat=${lat}&long=${long}`).then(r => r.json())
        
    }

    getUserLocationAndFetchEvents = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            this.fetchInitialEvents(pos.coords.latitude, pos.coords.longitude).then(response => {
                this.setState({
                events: response,
                long: pos.coords.longitude,
                lat: pos.coords.latitude,
                loading: false
                })
            })
        })
    }

    selectEventForDisplay = (e, eventObj) => {
        console.log("clicked", e)
        this.setState({
            selectedEvent: eventObj
        })
    }

    closeDisplay = () => {
        this.setState({
            selectedEvent: null
        })
    }

    focusOnEvent = (eventObj) => {
        console.log("focusing on", eventObj)
        let newVal = this.state.popupEvent ? null : eventObj
        this.setState({
            popupEvent: newVal
        })
    }

    

    showLoadingAnimation() {
        if (this.state.loading) {
            return (
                <Dimmer active>
                    <Loader />
                </Dimmer>
            )
        }
    }

    renderMapIfReady() {
        return !this.state.loading ? <MapDoc 
        long={this.state.long} 
        lat={this.state.lat} 
        events={this.state.events} 
        selectEventForDisplay={this.selectEventForDisplay}
        popUpEvent={this.state.popupEvent}
        togglePopUpFocus={this.focusOnEvent}/> : null
    }

    render() {
        return (
        <div>
            <Search />
            <div className="dataDisplayContainer">
                {this.showLoadingAnimation()}
                {this.state.selectedEvent ? <EventDisplay event={this.state.selectedEvent} closeDisplay={this.closeDisplay}/> : null}
                {this.renderMapIfReady()}
            </div>
        </div>
    )
    }
}

export default MainDisplay;