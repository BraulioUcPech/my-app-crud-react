import { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [userId, setUserId] = useState('');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [idEdit, setIdEdit] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error('Error al cargar los álbumes:', error));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = albums.slice(indexOfFirstItem, indexOfLastItem);


  const handleSubmit = (e) => {
  e.preventDefault();

  if (!userId || !id || !title) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  const album = {
    userId: parseInt(userId),
    id: parseInt(id),
    title: title,
  };

  if (!isEditing) {
    fetch('https://jsonplaceholder.typicode.com/albums', {
      method: 'POST',
      body: JSON.stringify(album),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAlbums([...albums, data]);
        alert('Álbum creado con éxito');
      })
      .catch((error) => {
        console.error('Error al crear el álbum:', error);
        alert('Error al crear el álbum');
      });
  } else {
    fetch(`https://jsonplaceholder.typicode.com/albums/${idEdit}`, {
      method: 'PUT',
      body: JSON.stringify(album),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        const updatedAlbums = currentItems.map((album) =>
          album.id === idEdit ? album : album
        );
        setAlbums(updatedAlbums);
        setIsEditing(false);
        alert('Álbum actualizado con éxito');
      })
      .catch((error) => {
        console.error('Error al actualizar el álbum:', error);
        alert('Error al actualizar el álbum');
      });
  }

  setUserId('');
  setId('');
  setTitle('');
};

const handleDelete = (id) => {
  const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este álbum?');
  if (confirmDelete) {
    fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedAlbums = albums.filter((album) => album.id !== id);
        setAlbums(updatedAlbums);
        alert('Álbum eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error al eliminar el álbum:', error);
        alert('Error al eliminar el álbum');
      });
  }
};
window.scrollTo({
  top: 1000,
  behavior: 'smooth'
});

  const handleEdit = (id) => {
    const album = albums.find((album) => album.id === id);
    setIsEditing(true);
    setUserId(album.userId.toString());
    setId(album.id.toString());
    setTitle(album.title);
    setIdEdit(id);
  };
   

  return (
    
  <div className="App">
    <form onSubmit={handleSubmit} className="form">
      <input
        type="number"
        placeholder="userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="input"
      />
      <input
        type="number"
        placeholder="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <button type="submit" className="submit-button">{isEditing ? 'Editar' : 'Crear'}</button>
      </form>

       <div className="table">
      {currentItems.map((album) => (
        <div key={album.id} className="table-row">
          <div className="table-cell">{album.userId}</div>
          <div className="table-cell">{album.id}</div>
          <div className="table-cell">{album.title}</div>
          <div className="table-cell">
            <button onClick={() => handleDelete(album.id)} className="delete-button">Eliminar</button>
            <button onClick={() => handleEdit(album.id)} className="edit-button">Editar</button>
          </div>
        </div>
      ))}
      </div>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >Anterior
      </button>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === Math.ceil(albums.length / itemsPerPage)}
      >Siguiente
      </button>
  </div>
);
}

export default App;




