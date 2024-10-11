import { Container, Col, Row, Button } from 'react-bootstrap';
import background from './assets/background3.jpeg';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import searchImg from './assets/search.jpg';
import { useNavigate } from 'react-router-dom';
function HomePage({allCharacters}){
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('1');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    autoCompleteResults(value);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedOption);
    if(selectedOption === '1'){
      navigate('/Characters', { state: { searchTerm } });
    }else if(selectedOption === '2'){
      navigate('/Locations', { state: { searchTerm } });
    }
  };

  function autoCompleteResults(input) {
    const localInput = input.toLowerCase();
    const matchingCharacters = allCharacters.filter(character =>
      character.name.toLowerCase().startsWith(localInput)
    );
    setSuggestions(matchingCharacters);
  }

  const handleSuggestionClick = (name) => {
    setSearchTerm(name.toLowerCase());
    setSuggestions([]);
  };

  useEffect(() => {
    console.log("Updated searchTerm:", searchTerm);
  }, [searchTerm]);

  return(
    <div className="full-screen-image">
      <img src={background}  alt="logo" />
      <Container fluid id="search-container">
        <Form onSubmit={handleSubmit}>  
          <Row className="justify-content-center">
            <Col xs={5} id='search-col'>
              <Form.Group
                id='term-search'
                label=''
              >
                <Form.Control
                  id='term-search-control'
                  type='text'
                  placeholder='Search..'
                  autoComplete='off'
                  value={searchTerm}
                  onChange={handleInputChange}
      
                />
                {suggestions.length > 0 && (
                  <ul className="suggestion-list">
                    {suggestions.map(character => (
                      <li
                        key={character.id}
                        onClick={() => handleSuggestionClick(character.name)}
                        className="suggestion-item"
                      >
                        {character.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div id="results" style={{display: 'none'}} ></div>
              </Form.Group> 
            </Col>
            <Col xs={2} id='search-col'>
              <Form.Select 
                id="type-select" 
                aria-label="Floating label select example" 
                defaultValue="1"
                value={selectedOption}
                onChange={handleSelectChange}
                >
                <option value="1">Character</option>
                <option value="2">Location</option>
              </Form.Select>
            </Col>
            <Col xs={2} id='search-col'>
              <Button id='search-btn' type="submit">
                <img id='search-img' src={searchImg}  alt="logo" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  )
}
export default HomePage;