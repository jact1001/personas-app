import React from "react";
import { Route, Routes } from "react-router-dom";
import Person from "./components/person";

const App = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/:id" element={<Person />} />
            </Routes>
        </div>
    );
};

export default App;