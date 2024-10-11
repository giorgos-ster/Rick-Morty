import React, { useState, useEffect, useRef } from 'react';
import './Styles.css';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';
import searchImg from './assets/search.jpg';
import { Container, Row, Col, Form, Card, Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
const Characters = ({ allCharacters, allEpisodes }) => {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({ pages: 0, next: null, prev: null });
  const [show, setShow] = useState(false);
  const [localCharactersById, setLocalCharactersById] = useState(characters)
  const [episodes, setEpisodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [currentCharacters, setCurrentCharacters] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [statusFilter, setStatusFilter] = useState('0');
  const [genderFilter, setGenderFilter] = useState('0');
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const initialSearchTerm = location.state?.searchTerm || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
  };

  const handleSearchTermChange = (e) => {   
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentCharacters(allCharacters.slice(startIndex, endIndex));
  }, [currentPage, allCharacters]);

  const handleTotalPagesChange = () => {
    setTotalPages(Math.ceil(allCharacters.length / itemsPerPage));
    console.log(totalPages);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
    
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    setEpisodes(allEpisodes);
    handleTotalPagesChange();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredCharacters = allCharacters
      .filter(character => {

        let statusMatch = true;
        if (statusFilter === '1') statusMatch = character.status === 'Alive';
        if (statusFilter === '2') statusMatch = character.status === 'Dead';
        if (statusFilter === '3') statusMatch = character.status === 'unknown';
        if (statusFilter === '0') statusMatch = true;

        let genderMatch = true;
        if (genderFilter === '1') genderMatch = character.gender === 'Male';
        if (genderFilter === '2') genderMatch = character.gender === 'Female';
        if (genderFilter === '3') genderMatch = character.gender === 'unknown';
        if (genderFilter === '0') genderMatch = true;

        let searchMatch = character.name.toLowerCase().includes(searchTerm);

        return statusMatch && genderMatch && searchMatch;
      })
      .slice(startIndex, endIndex);
        
    setCurrentCharacters(filteredCharacters);
    handleTotalPagesChange()
  }, [currentPage, allCharacters, statusFilter, genderFilter, searchTerm]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCharacterId = (id) => {
    const character = allCharacters.find(char => char.id === id);
    const episodeIds = character.episode.map(url => url.split('/').pop());
    const characterEpisodes = allEpisodes.filter(episode => episodeIds.includes(episode.id.toString()));
  
    setLocalCharactersById([character]);
    setEpisodes(characterEpisodes);
    handleShow();
  };

  const toggleExpanded = () => setExpanded(prevExpanded => !prevExpanded);
  const normalizedEpisodes = Array.isArray(episodes) ? episodes : [episodes];

  return (
    <Container fluid id="characters-container">
      <Container>
          <Form>
          <Row className="justify-content-end">
            <Col id='search-col'>
            <Form.Group
              id='term-search'
              label=''
              >
              <Form.Control
                id='term-search-control'
                type='text'
                placeholder='Search..'
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
              </Form.Group> 
            </Col>
            <Col id='search-col'>
            <Form.Select 
                  id="type-select" 
                  aria-label="Floating label select example" 

                  value={statusFilter}
                  onChange={handleStatusChange}
                  >
                  <option value="0">All Status</option>
                  <option value="1">Alive</option>
                  <option value="2">Dead</option>
                  <option value="3">Unknown</option>
                </Form.Select>
            </Col>
            <Col id='search-col'>
            <Form.Select 
                  id="type-select" 
                  aria-label="Floating label select example" 
                  
                  value={genderFilter}
                  onChange={handleGenderChange}
                  >
                  <option value="0">All Genders</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Unknown</option>
                </Form.Select>
            </Col>

            </Row>
          </Form>
        
      </Container>
      <Container id="cards-container">
        <Row>
          {currentCharacters.length > 0 ? (
            <>
              {currentCharacters.map((character) => (
                <Col md="3" key={character.id} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={character.image} alt={character.name} />
                    <Card.Body>
                      <Card.Title>{character.name}</Card.Title>
                      <Card.Text>Status: {character.status}</Card.Text>
                      <Card.Text>Species: {character.species}</Card.Text>
                      <Card.Text>Gender: {character.gender}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button id="card-btn" onClick={() => handleCharacterId(character.id)}>Character Details</Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
              {localCharactersById.map((character) => (
                <Modal key={character.id} show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>{character.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Card.Img variant="top" src={character.image} alt={character.name} />
                    <Card.Text>Status: {character.status}</Card.Text>
                    <Card.Text>Species: {character.species}</Card.Text>
                    <Card.Text>Type: {character.type}</Card.Text>
                    <Card.Text>Gender: {character.gender}</Card.Text>
                    <Card.Text>Origin: {character.origin.name}</Card.Text>
                    <Card.Text>Location: {character.location.name}</Card.Text>
                  </Modal.Body>
                  
                  <Modal.Footer id="episodes-list-footer">
                    <Button id="episodes-list-btn" onClick={toggleExpanded}>{expanded ? 'Hide Episodes' : 'Show Episodes'}</Button>
                    {expanded && normalizedEpisodes.map((episode) => (
                      <Card.Text key={episode.id}>{episode.id} - {episode.name} - {episode.air_date}</Card.Text>
                    ))}
                  </Modal.Footer>
                </Modal>
              ))}
            </>
          ) : (
            <Container id="no-results-container" fluid>
              <h1>No results. Maybe in the next episode?</h1>
            </Container>
          )}
        </Row>
        {(currentCharacters.length > 0) ? (
          <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            
            {paginationItems.slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages))}

            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === info.pages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
        ) : (
          <div></div>
        )
        }
      </Container>
    </Container>
  );
};

export default Characters;
