import React from "react";
import { Route, BrowserRouter as Router, Switch, withRouter  } from "react-router-dom";
import './App.css';
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import EventAdd from "./components/EventAdd/EventAdd";
import EventList from "./components/EventList/EventList";
import EventPage from "./components/EventPage/EventPage";
import EventEdit from "./components/EventEdit/EventEdit";
import EventSearch from "./components/EventSearch/EventSearch";
import EventTypeAdd from "./components/EventTypeAdd/EventTypeAdd";
import EventTypeEdit from "./components/EventTypeEdit/EventTypeEdit";
import EventLocationAdd from "./components/EventLocationAdd/EventLocationAdd.js";
import EventLocationEdit from "./components/EventLocationEdit/EventLocationEdit";
import EventCountryAdd from "./components/EventCountryAdd/EventCountryAdd.js";
import EventCountryEdit from "./components/EventCountryEdit/EventCountryEdit.js";
import EventAddressAdd from "./components/EventAddressAdd/EventAddressAdd.js";
import EventAddressEdit from "./components/EventAddressEdit/EventAddressEdit.js";
import EventPlaceAdd from "./components/EventPlaceAdd/EventPlaceAdd.js";
import EventPlaceEdit from "./components/EventPlaceEdit/EventPlaceEdit.js";
import ProfileEdit from "./components/ProfileEdit/ProfileEdit";
import ControlPanelEvents from "./components/ControlPanelEvents/ControlPanelEvents";
import ControlPanelLocations from "./components/ControlPanelLocations/ControlPanelLocations";
import ControlPanelTypes from "./components/ControlPanelTypes/ControlPanelTypes";
import ControlPanelImages from "./components/ControlPanelImages/ControlPanelImages";
import ControlPanelComments from "./components/ControlPanelComments/ControlPanelComments";
import ControlPanelCountries from "./components/ControlPanelCountries/ControlPanelCountries";
import ControlPanelAddresses from "./components/ControlPanelAddresses/ControlPanelAddresses";
import ControlPanelPlaces from "./components/ControlPanelPlaces/ControlPanelPlaces";


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path ="/control_panel/edit_event_place/:id" component={EventPlaceEdit} />
          <Route path ="/control_panel/edit_event_address/:id" component={EventAddressEdit} />
          <Route path ="/control_panel/edit_event_country/:id" component={EventCountryEdit} />
          <Route path="/control_panel/add_event_place" component={EventPlaceAdd} />
          <Route path="/control_panel/add_event_address" component={EventAddressAdd} />
          <Route path="/control_panel/add_event_country" component={EventCountryAdd} />
          <Route path="/control_panel/places" component={ControlPanelPlaces} /> 
          <Route path="/control_panel/addresses" component={ControlPanelAddresses} />
          <Route path="/control_panel/countries" component={ControlPanelCountries} />
          <Route path="/control_panel/images" component={ControlPanelImages} />
          <Route path="/control_panel/comments" component={ControlPanelComments} />
          <Route path="/control_panel/event_types" component={ControlPanelTypes} />
          <Route path="/control_panel/locations" component={ControlPanelLocations} />
          <Route path="/control_panel/events" component={ControlPanelEvents} />
          <Route path="/users/:name" component={ProfileEdit} />
          <Route path="/control_panel/add_event_location" component={EventLocationAdd} />
          <Route path ="/control_panel/edit_event_location/:id" component={EventLocationEdit} />
          <Route path ="/control_panel/edit_event_type/:id" component={EventTypeEdit} />
          <Route path="/control_panel/add_event_type" component={EventTypeAdd} />
          <Route path="/event_search" component={EventSearch} />
          <Route path ="/control_panel/edit_event/:id" component={EventEdit} />
          <Route path="/event_list/:id" render={(props) => <EventList {...props} keyProp={Math.random()} key={Math.random()}/>}  />
          <Route path="/event/:id" component={EventPage} />
          <Route path="/control_panel/add_event" component={EventAdd} />
          <Route path="/control_panel" component={ControlPanel} />
          <Route path="/login/login" component={Login} />
          <Route path="/login/register" component={Register} />
          <Route path="/" reloadProp={Math.random()} render={(props) => <Home {...props} keyProp={Math.random()} key={Math.random()}/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;


