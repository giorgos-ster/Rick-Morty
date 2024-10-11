import { Container, Pagination, ListGroup, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function Episodes({allEpisodes, allCharacters}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        console.log(allEpisodes);
        groupEpisodesBySeason(allEpisodes);
    }, []);


    const groupEpisodesBySeason = (episodes) => {
        const seasons = episodes.reduce((acc, episode) => {
        const seasonNumber = episode.episode.substring(1, 3);
        if (!acc[seasonNumber]) {
            acc[seasonNumber] = [];
        }
        acc[seasonNumber].push(episode);
        return acc;
        }, {});

        setSeasons(Object.values(seasons));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

  const currentEpisodes = seasons[currentPage - 1] || [];
  let paginationItems = [];
  for (let number = 1; number <= seasons.length; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        season {number}
      </Pagination.Item>
    );
  }

  return (
    <Container fluid id="episodes-container" className='d-flex flex-column'>
      <ListGroup>
        {currentEpisodes.map((episode) => (
          <ExpandableListGroupItem key={episode.id} episode={episode} allCharacters={allCharacters} />
        ))}
      </ListGroup>
      <div id="episodes-paginator" className="d-flex justify-content-center mt-auto">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {paginationItems}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === seasons.length} />
          <Pagination.Last onClick={() => handlePageChange(seasons.length)} disabled={currentPage === seasons.length} />
        </Pagination>
      </div>
    </Container>
  );
}

export default Episodes;

function ExpandableListGroupItem({ episode, allCharacters }) {
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
            {episode.episode} - {episode.name}
            </Col>
            <Col className="d-flex justify-content-end">
            {episode.air_date}
            </Col>
        </Row>
        {expanded && (
        <div>
            <p></p>
            <Row>
            {episode.characters.map((characterUrl) => {
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