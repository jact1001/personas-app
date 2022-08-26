import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

export default function Create() {
    const [person, setPerson] = useState();
    const [queries, setQueries] = useState([]);
    const params = useParams();

    useEffect(() => {
        getPerson();
        getQuestion(1);
        getQuestion(2);
    }, [params.id]);

    const getPerson = async () => {
        const id = params.id.toString();
        const response = await fetch(`http://localhost:5001/person/${params.id.toString()}`);
        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
        }
        const person = await response.json();
        if (!person) {
            window.alert(`Record with id ${id} not found`);
        }
        setPerson(person);
    }

    const getQuestion = async (id) => {
        const response = await fetch(`http://localhost:5001/query-${id}`);
        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
        }
        const query = await response.json();
        if (!query) {
            window.alert(`queries with id not found`);
        }
        setQueries(arr => [query, ...arr]);
    }

    return (
        <Container>
            <br/>
            <Row>
                <Card><Card.Body><h3>Bienvenido <strong>{person?.name}</strong></h3></Card.Body></Card>
            </Row>
            <br/>
            <h5>Tus últimas preguntas son: </h5>
            <ListGroup>
                {person?.last_questions && person.last_questions.map((question, index) => {
                    return(<ListGroup.Item key={index}>{question.description} <Badge bg="secondary"> con {question.answers.length} respuestas</Badge></ListGroup.Item>)
                })}
            </ListGroup>
            <br/>
            <Row>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Query #1</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup>
                                {queries && queries[0] && queries[0].map((person, index) => {
                                    return(<ListGroup.Item key={index}>{person.name} <Badge bg="primary"> {person.country}</Badge></ListGroup.Item>)
                                })}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Query #2</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup>
                                {queries && queries[1] && queries[1].map((question, index) => {
                                    return(<ListGroup.Item key={index}>{question.description} <Badge bg="primary"> {question.register_date}</Badge></ListGroup.Item>)
                                })}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </Container>
    );
}