import React, { useEffect, useState } from 'react'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

const App = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', firstVisit: '', nextVisit: '' })
  const [editingId, setEditingId] = useState(null)

  // Fetch clients
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = () => {
    setLoading(true)
    axios.get(baseURL)
      .then(res => {
        setClients(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch clients')
        setLoading(false)
      })
  }

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Create or update client
  const handleSubmit = e => {
    e.preventDefault()
    if (editingId) {
      axios.put(baseURL + `/${editingId}`, form)
        .then(() => {
          fetchClients()
          setForm({ name: '', phone: '', firstVisit: '', nextVisit: '' })
          setEditingId(null)
        })
        .catch(() => setError('Failed to update client'))
    } else {
      axios.post(baseURL, form)
        .then(() => {
          fetchClients()
          setForm({ name: '', phone: '', firstVisit: '', nextVisit: '' })
        })
        .catch(() => setError('Failed to add client'))
    }
  }

  // Edit client
  const handleEdit = client => {
    setForm({
      name: client.name,
      phone: client.phone,
      firstVisit: client.firstVisit,
      nextVisit: client.nextVisit
    })
    setEditingId(client._id)
  }

  // Delete client
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      axios.delete(baseURL + `/${id}`)
        .then(() => fetchClients())
        .catch(() => setError('Failed to delete client'))
    }
  }

  return (
    <div>
      <h1>Client Management</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="firstVisit"
          placeholder="First Visit"
          value={form.firstVisit}
          onChange={handleChange}
          required
        />
        <input
          name="nextVisit"
          placeholder="Next Visit"
          value={form.nextVisit}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Client</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', phone: '', firstVisit: '', nextVisit: '' }) }}>Cancel</button>}
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>First Visit</th>
              <th>Next Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client._id}>
                <td>{client._id}</td>
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td>{client.firstVisit}</td>
                <td>{client.nextVisit}</td>
                <td>
                  <button onClick={() => handleEdit(client)}>Edit</button>
                  <button onClick={() => handleDelete(client._id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
