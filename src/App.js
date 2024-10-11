import './Styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link  } from 'react-router-dom';
import HomePage from './HomePage';
import Characters from './Characters';
import Locations from './Locations';
import Episodes from './Episodes';
import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from './assets/logo.png'
import logo2 from './assets/logo_2.png'
import logo3 from './assets/logo_3.png'
import logo4 from './assets/logo_4.png'



function App() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allEpisodes, setAllEpisodes] = useState([]);

  useEffect(() => {
    const fetchAllCharacters = async () => {

      let fetchedAllCharacters = [];
      let nextPageUrl = `https://rickandmortyapi.com/api/character`;

      while (nextPageUrl) {
        try {
          const response = await axios.get(nextPageUrl);
          fetchedAllCharacters = fetchedAllCharacters.concat(response.data.results);
          nextPageUrl = response.data.info.next;
        } catch (error) {
          console.error("Failed to fetch characters:", error);
          nextPageUrl = null;
        }
      }
      setAllCharacters(fetchedAllCharacters);
    };
    fetchAllCharacters();
  }, []);

  useEffect(() => {
    const fetchAllLocations = async () => {

      let fetchedAllLocations = [];
      let nextPageUrl = `https://rickandmortyapi.com/api/location`;

      while (nextPageUrl) {
        try {
          const response = await axios.get(nextPageUrl);
          fetchedAllLocations = fetchedAllLocations.concat(response.data.results);
          nextPageUrl = response.data.info.next;
        } catch (error) {
          console.error("Failed to fetch characters:", error);
          nextPageUrl = null;
        }
      }
      setAllLocations(fetchedAllLocations);
    };
    fetchAllLocations();
  }, []);

  useEffect(() => {
    const fetchAllEpisodes = async () => {
      let fetchedAllEpisodes = [];
      let nextPageUrl = `https://rickandmortyapi.com/api/episode`;

      while (nextPageUrl) {
        try {
          const response = await axios.get(nextPageUrl);
          fetchedAllEpisodes = fetchedAllEpisodes.concat(response.data.results);
          nextPageUrl = response.data.info.next;
        } catch (error) {
          console.error("Failed to fetch episodes:", error);
          nextPageUrl = null;
        }
      }
      setAllEpisodes(fetchedAllEpisodes);
    };
    fetchAllEpisodes();
  }, []);

  return (
    <Router>
      <div>
        <Navbar id="navbar"  expand="sm" >
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img src={logo} width="35" height="35" className="d-inline-block align-top" alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/Characters" >
                  <img src={logo2} width="35" height="35" className="d-inline-block align-top" alt="logo" />
                    Characters</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/Locations">
                  <img src={logo3} width="35" height="35" className="d-inline-block align-top" alt="logo" />
                    Locations</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/Episodes">
                  <img src={logo4} width="35" height="35" className="d-inline-block align-top" alt="logo" />
                    Episodes</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
          <Routes>
            <Route path="/" element={<HomePage allCharacters={allCharacters}/>} />
            <Route path="/Characters" element={<Characters allCharacters={allCharacters} allEpisodes={allEpisodes}/>} />
            <Route path="/Locations" element={<Locations allLocations={allLocations} allCharacters={allCharacters}/>} />
            <Route path="/Episodes" element={<Episodes allEpisodes={allEpisodes} allCharacters={allCharacters}/>} />
          </Routes>

      </div>
    </Router>
  );
}

export default App;
