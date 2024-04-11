import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom';

function ResourceSelector({ onSelectResource }) {
  return (
    <select onChange={(e) => onSelectResource(e.target.value)}>
      <option value="people">People</option>
      <option value="planets">Planets</option>
      {/* Agregar opciones para otros recursos si es necesario */}
    </select>
  );
}

function ResourceInput({ onChangeId }) {
  return (
    <input type="number" placeholder="Resource ID" onChange={(e) => onChangeId(e.target.value)} />
  );
}

function FetchButton({ onClick }) {
  return (
    <button onClick={onClick}>Fetch Data</button>
  );
}

function App() {
  const [resource, setResource] = useState('people');
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://swapi.dev/api/${resource}/${id}/`);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (error) {
      setError('These are not the droids you are looking for.');
    }
  };

  useEffect(() => {
    if (id && resource) {
      fetchData();
    }
  }, [id, resource]);

  return (
    <div>
      <ResourceSelector onSelectResource={setResource} />
      <ResourceInput onChangeId={setId} />
      <FetchButton onClick={fetchData} />
      {error && (
        <div>
          <p>{error}</p>
          <img src="https://i.imgur.com/tk7qkif.jpg" alt="Obi-Wan Kenobi" />
        </div>
      )}
      {data && (
        <div>
          {Object.keys(data).slice(0, 4).map((key) => (
            <p key={key}><strong>{key}:</strong> {data[key]}</p>
          ))}
          {resource === 'people' && data.homeworld && (
            <p><strong>Homeworld:</strong> {data.homeworld}</p>
          )}
        </div>
      )}
    </div>
  );
}

function PersonPage() {
  const { id } = useParams();
  const [personData, setPersonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const jsonData = await response.json();
        setPersonData(jsonData);
      } catch (error) {
        console.error('Error fetching person data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {personData && (
        <div>
          <h1>{personData.name}</h1>
          <p><strong>Height:</strong> {personData.height}</p>
          <p><strong>Mass:</strong> {personData.mass}</p>
          {/* Mostrar más atributos si es necesario */}
        </div>
      )}
    </div>
  );
}

function Routes() {
  return (
    <Router> 
      <Route exact path="/" component={App} />
      <Route path="/:id" component={PersonPage} />
    </Router>
  );
}

export default App;