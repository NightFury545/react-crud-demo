import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const App = () => {

  const [rows, setRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', country: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setRows(response.data);
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    axios.post('http://localhost:5000/users', formData)
      .then(response => {
        setRows([...rows, response.data]);
        setFormData({ name: '', age: '', country: '' });
      })
      .catch(error => {
        console.error("Error creating data", error);
      });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/users/${editingRow.id}`, formData)
      .then(response => {
        setRows(rows.map((row) => (row.id === editingRow.id ? response.data : row)));
        setEditingRow(null);
        setFormData({ name: '', age: '', country: '' });
      })
      .catch(error => {
        console.error("Error updating data", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        setRows(rows.filter((row) => row.id !== id));
      })
      .catch(error => {
        console.error("Error deleting data", error);
      });
  };

  return (
    <>
      <TableContainer component={Paper} style={{ margin: '25px', width: '75%', justifySelf: 'center' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ім'я</TableCell>
              <TableCell>Вік</TableCell>
              <TableCell>Країна</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditingRow(row); setFormData(row); }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ padding: '25px', justifySelf: 'center' }}>
        <TextField
          label="Ім'я"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Вік"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
        <TextField
          label="Країна"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        />

        {editingRow ? (
          <Button onClick={handleUpdate}>Оновити</Button>
        ) : (
          <Button onClick={handleCreate}>Додати</Button>
        )}
      </div>
    </>
  );
};

export default App;
