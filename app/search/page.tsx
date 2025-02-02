"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Form, Row, Col, Modal } from "react-bootstrap";
import styles from "./page.module.css";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const Search = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalDogs, setTotalDogs] = useState(0);
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        { withCredentials: true }
      );
      setBreeds(response.data);
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      const response = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/search",
        {
          params: {
            breeds: selectedBreed ? [selectedBreed] : [],
            sort: `breed:${sortOrder}`,
            size: 12,
            from: (page - 1) * 12,
          },
          withCredentials: true,
        }
      );

      const dogIds = response.data.resultIds;
      console.log(dogIds);
      const dogDetailsResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        dogIds,
        { withCredentials: true }
      );

      setDogs(dogDetailsResponse.data);
      setTotalDogs(response.data.total);
    };

    fetchDogs();
  }, [selectedBreed, sortOrder, page]);

  const handleFavorite = (dogId: string) => {
    setFavoriteDogs((prev) => {
      if (prev.includes(dogId)) {
        return prev.filter((id) => id !== dogId);
      }
      return [...prev, dogId];
    });
  };

  const generateMatch = async () => {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      favoriteDogs,
      { withCredentials: true }
    );
    if (response.status === 200) {
      const matchedDogId: Dog[] = [];
      matchedDogId.push(response.data.match);
      const matchedDogData = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        matchedDogId,
        { withCredentials: true }
      );
      console.log("Matched Dog ID:", matchedDogId);
      console.log("Matched Dog:", matchedDogData.data[0]);
      setMatchedDog(matchedDogData.data[0]);
      setShowMatchModal(true);
    }
  };

  const totalPages = Math.ceil(totalDogs / 12);
  const pageNumbers = [];

  const pageWindow = 9;
  let startPage = Math.max(1, page - 4);
  let endPage = Math.min(totalPages, page + 4);

  if (endPage - startPage < pageWindow) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + pageWindow - 1);
    } else {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Container className="mt-5">
      <h1>Search Dogs</h1>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="breed-select">
            <Form.Label>Breed:</Form.Label>
            <Form.Control
              as="select"
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              aria-label="Select a breed"
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="sort-order-select">
            <Form.Label>Sort Breed Order:</Form.Label>
            <Form.Control
              as="select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Select a sort orde for the breed"
            >
              <option value="asc">Sort Ascending</option>
              <option value="desc">Sort Descending</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {dogs.map((dog) => (
          <Col key={dog.id} sm={12} md={6} lg={4} className="my-2">
            <Card>
              <Card.Img
                variant="top"
                src={dog.img}
                alt={dog.name}
                className={styles.cardImage}
              />
              <Card.Body>
                <Card.Title className={styles.dogName}>{dog.name}</Card.Title>
                <Card.Text>Breed: {dog.breed}</Card.Text>
                <Card.Text>Age: {dog.age}</Card.Text>
                <Card.Text>Location: {dog.zip_code}</Card.Text>
                <button
                  onClick={() => handleFavorite(dog.id)}
                  className={
                    favoriteDogs.includes(dog.id) ? styles.favoritePet : ""
                  }
                  aria-label={`Toggle favorite for ${dog.name}`}
                >
                  {favoriteDogs.includes(dog.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Previous
        </button>

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`mx-1 ${page === pageNum ? "active" : ""}`}
            aria-label={`Go to page ${pageNum}`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
      <button
        onClick={generateMatch}
        disabled={favoriteDogs.length === 0}
        className="mt-4"
        aria-label="Generate match"
      >
        Generate Match
      </button>

      <Modal show={showMatchModal} onHide={() => setShowMatchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Matched Dog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {matchedDog && (
            <Card>
              <Card.Img
                variant="top"
                src={matchedDog.img}
                alt={matchedDog.name}
              />
              <Card.Body>
                <Card.Title className={styles.dogName}>
                  {matchedDog.name}
                </Card.Title>
                <Card.Text>Breed: {matchedDog.breed}</Card.Text>
                <Card.Text>Age: {matchedDog.age}</Card.Text>
                <Card.Text>Location: {matchedDog.zip_code}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowMatchModal(false)}>Close</button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Search;
