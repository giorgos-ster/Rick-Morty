import React, { useState, useEffect } from 'react';
import './Styles.css';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';
import searchImg from './assets/search.jpg';
import { Container, Row, Col, Form, Card, ListGroup, Button } from 'react-bootstrap';

const Locations = ({allLocations, allCharacters}) => {
    //const [allLocations, setAllLocations] = useState([]);
    const [info, setInfo] = useState({ pages: 0, next: null, prev: null });
    const [currentLocations, setCurrentLocations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setCurrentLocations(allLocations.slice(startIndex, endIndex));
    }, [currentPage, allLocations]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        setTotalPages(Math.ceil(allLocations.length / itemsPerPage));
    }, [allLocations]);

    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                {number}
            </Pagination.Item>
        );
    }
  return (
    <Container fluid id="locations-container" className='d-flex flex-column'>
        <ListGroup>
            {currentLocations.map((location) => (
            <ExpandableListGroupItem key={location.id} location={location} allCharacters={allCharacters} />
            ))}
        </ListGroup>
        <div id="locations-paginator" className="d-flex justify-content-center mt-auto">
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                
                {paginationItems.slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages))}

                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === info.pages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    </Container>
    
  );
};

export default Locations;


function ExpandableListGroupItem({ location, allCharacters }) {
    const [expanded, setExpanded] = useState(false);
    const getCharacterIdFromUrl = (url) => {
        const match = url.match(/\/character\/(\d+)/);
        return match ? match[1] : null;
    };
    const getCharacterById = (id) => allCharacters.find(char => char.id.toString() === id);
    
    return (
      <ListGroup.Item
        action
        onClick={() => setExpanded(!expanded)}
        aria-controls="example-collapse-text"
        aria-expanded={expanded}
      >
        <Row>
            <Col>
            {location.name} - {location.type}
            </Col>
            <Col className="d-flex justify-content-end">
            {location.dimension}
            </Col>
        </Row>
        {expanded && (
        <div>
            <p></p>
            <Row>
                {location.residents.map((characterUrl) => {
                const charId = getCharacterIdFromUrl(characterUrl);
                const character = getCharacterById(charId);
                return character ? (
            
                    <Col md="2">
                    <div key={character.id}>
                    <img src={character.image} alt={character.name} style={{ width: '170px', height: '170px' }} />
                    <p>{character.name}</p>
                    </div>
                    </Col>
                
                ) : null;
                })}
            </Row>
        </div>
        )}
      </ListGroup.Item>
    );
  }