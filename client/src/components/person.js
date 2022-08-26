import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function Create() {
    const [person, setPerson] = useState();
    const params = useParams();

    async function onSubmit(e) {
        const question = '1'
        e.preventDefault();
        await fetch("http://localhost:5001//add", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(question),
        }).then(res => {

        }).catch(error => {
                window.alert(error);
                return;
            });

    }

    useEffect(() => {
        getPerson();
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

    return (
        <div>
            <h3>Bienvenido</h3>
            <h4>{person?.name}</h4>
            <h5>Tus últimas preguntas son: </h5>
            <ul>
                {person?.last_questions && person.last_questions.map((question, index) => {
                    return(<li key={index}>{question.description} con {question.answers.length} respuestas</li>)
                })}
            </ul>
        </div>
    );
}