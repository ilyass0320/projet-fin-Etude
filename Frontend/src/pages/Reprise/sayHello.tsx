import React, { useState, useEffect } from 'react'

const sayHello = () => {
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetch("http://localhost:8080/api/hello")
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);
    return (
        <div>
            <h1>{message}</h1>
        </div>
    )
}

export default sayHello
