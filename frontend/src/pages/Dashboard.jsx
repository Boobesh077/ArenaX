import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [tournaments, setTournaments] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    start_date: "",
    status: "Upcoming"
  });

  // Protect Dashboard
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Get tournaments
  useEffect(() => {
    fetch("http://127.0.0.1:5000/tournaments")
      .then((response) => response.json())
      .then((data) => {
        setTournaments(data);
      })
      .catch((error) => {
        console.error("Error fetching tournaments:", error);
      });
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create tournament
  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then(() => {
        return fetch("http://127.0.0.1:5000/tournaments");
      })
      .then((response) => response.json())
      .then((data) => {
        setTournaments(data);

        setFormData({
          name: "",
          game: "",
          description: "",
          start_date: "",
          status: "Upcoming"
        });
      })
      .catch((error) => {
        console.error("Error creating tournament:", error);
      });
  };

  // Delete tournament
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/tournaments/${id}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        setTournaments(
          tournaments.filter((tournament) => tournament.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting tournament:", error);
      });
  };

  // Edit tournament
  const handleEdit = (tournament) => {
    setEditId(tournament.id);

    setFormData({
      name: tournament.name,
      game: tournament.game,
      description: tournament.description,
      start_date: tournament.start_date,
      status: tournament.status
    });
  };

  // Update tournament
  const handleUpdate = () => {
    fetch(`http://127.0.0.1:5000/tournaments/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then(() => {
        setTournaments(
          tournaments.map((tournament) =>
            tournament.id === editId
              ? { ...tournament, ...formData }
              : tournament
          )
        );

        setEditId(null);

        setFormData({
          name: "",
          game: "",
          description: "",
          start_date: "",
          status: "Upcoming"
        });
      })
      .catch((error) => {
        console.error("Error updating tournament:", error);
      });
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <p>Email: {user?.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>Create Tournament</h2>

      <form onSubmit={handleCreate}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tournament Name"
          required
        />

        <br />
        <br />

        <input
          name="game"
          value={formData.game}
          onChange={handleChange}
          placeholder="Game"
          required
        />

        <br />
        <br />

        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <br />
        <br />

        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder="Status"
        />

        <br />
        <br />

        <button type="submit">
          Create Tournament
        </button>
      </form>

      <hr />

      <h2>Tournaments</h2>

      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        tournaments.map((tournament) => (
          <div key={tournament.id}>
            {editId === tournament.id ? (
              <div>
                <h3>Edit Tournament</h3>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tournament Name"
                />

                <br />
                <br />

                <input
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  placeholder="Game"
                />

                <br />
                <br />

                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                />

                <br />
                <br />

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />

                <br />
                <br />

                <input
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Status"
                />

                <br />
                <br />

                <button onClick={handleUpdate}>
                  Save
                </button>

                <button onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3>{tournament.name}</h3>

                <p>Game: {tournament.game}</p>

                <p>
                  Description: {tournament.description}
                </p>

                <p>
                  Start Date: {tournament.start_date}
                </p>

                <p>
                  Status: {tournament.status}
                </p>

                <button
                  onClick={() => handleEdit(tournament)}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(tournament.id)}
                >
                  Delete
                </button>
              </div>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;