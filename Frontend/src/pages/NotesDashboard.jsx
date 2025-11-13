import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NotesDashboard() {
    const [notes, setNotes] = useState([]);
    const [modal, setModal] = useState({ type: null, noteId: null, content: "" });
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Fetch notes
    const getNotes = async () => {
        try {
            const res = await api.get("/notes");
            setNotes(res.data.notes || []);
        } catch (error) {
            toast.error("Failed to fetch notes!");
            console.error(error);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    const openModal = (type, note = null) => {
        setModal({ type, noteId: note?._id || null, content: note?.content || "" });
    };

    const closeModal = () => setModal({ type: null, noteId: null, content: "" });

    const handleAddEdit = async () => {
        if (!modal.content.trim()) return toast.error("Note cannot be empty");
        try {
            if (modal.type === "add") {
                await api.post("/notes", { title: "Untitled", content: modal.content });
                toast.success("Note added successfully!");
            } else if (modal.type === "edit") {
                await api.patch(`/notes/${modal.noteId}`, { content: modal.content });
                toast.success("Note updated successfully!");
            }
            closeModal();
            getNotes();
        } catch (err) {
            toast.error("Action failed!");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            toast.success("Note deleted successfully!");
            getNotes();
        } catch (err) {
            toast.error("Delete failed!");
            console.error(err);
        }
    };

    const handleLogout = async () => {
        try {
            await api.get("/users/logout");
            localStorage.removeItem("token");
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (err) {
            toast.error("Logout failed!");
            console.error(err);
        }
    };

    const filteredNotes = notes.filter((n) =>
        n.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <header className="bg-indigo-600 text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow">
                <h1 className="text-xl font-bold">Notes Dashboard</h1>
                <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-8 py-2 rounded-lg text-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-3 py-1 rounded-lg cursor-pointer hover:bg-red-600"
                    >
                        Logout
                    </button>
                    <button
                        onClick={() => openModal("add")}
                        className="bg-green-500 px-3 py-1 rounded-lg cursor-pointer hover:bg-green-600"
                    >
                        Add Note
                    </button>
                </div>
            </header>

            {/* Notes Grid */}
            <main className="p-5 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {filteredNotes.length ? (
    filteredNotes.map((n) => (
      <div
        key={n._id}
        className="bg-white p-6 rounded-xl shadow flex flex-col justify-between break-words w-full"
      >
        <p className="whitespace-pre-wrap break-words overflow-hidden">
          {n.content}
        </p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => openModal("edit", n)}
            className="bg-yellow-400 px-2 py-1 rounded cursor-pointer hover:bg-yellow-500 text-white"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(n._id)}
            className="bg-red-500 px-2 py-1 rounded cursor-pointer hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500">
      No notes yet.
    </p>
  )}
</main>

            
            {modal.type && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-50"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.3)", 
                        backdropFilter: "blur(6px)",        
                    }}
                >
                    <div
                        className="rounded-lg p-6 w-11/12 sm:w-96 shadow-lg"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.9)", 
                            border: "2px solid #4F46E5",             
                        }}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            {modal.type === "add" ? "Add Note" : "Edit Note"}
                        </h2>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows="4"
                            value={modal.content}
                            onChange={(e) =>
                                setModal({ ...modal, content: e.target.value })
                            }
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={closeModal}
                                className="px-3 py-1 rounded bg-gray-300  cursor-pointer hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEdit}
                                className="px-3 py-1 rounded bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700"
                            >
                                {modal.type === "add" ? "Add" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}

export default NotesDashboard;
