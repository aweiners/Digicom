import { useState, useCallback, useEffect } from "react";
import Stickynote from "./Stickynote";
import closeButton from "../assets/closeButton.png";
import { v4 as uuidv4 } from "uuid";

export default function Notepad() {
  const [notes, setNotes] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [username, setUsername] = useState("student");
  const [authToken, setAuthToken] = useState("");

  // Toggle between student and admin roles
  const toggleRole = async () => {
    const newUsername = username === "student" ? "admin" : "student";
    await loginUser(newUsername);
  };

  // Login user and get auth token
  const loginUser = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user }),
      });

      const data = await response.json();

      if (data.success) {
        setUsername(user);
        setUserRole(data.user.role);
        setAuthToken(data.token);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Login
  useEffect(() => {
    loginUser(username);
  }, []);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const addNote = useCallback(async () => {
    if (content.trim()) {
      const noteId = uuidv4();
      const newNote = { id: noteId, title, content };

      try {
        const response = await fetch("http://localhost:5000/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newNote),
        });

        const data = await response.json();

        if (data.success) {
          setNotes((prev) => [...prev, newNote]);
          setTitle("");
          setContent("");
          setShowInput(false);
        }
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  }, [title, content, authToken]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setShowInput(false);
      if (e.key === "Enter" && e.shiftKey === false) {
        e.preventDefault();
        addNote();
      }
    };
    if (showInput) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showInput, addNote]);

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        console.error("Error deleting note:", data.error);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-[83vw] mx-10 mt-24 p-6 bg-white/20 backdrop-blur rounded-2xl border border-gray-400">
      <div className="flex w-full justify-between mb-6">
        <button
          onClick={() => setShowInput(true)}
          className="px-4 py-2 border-2 border-white text-white rounded hover:bg-white hover:text-blue-900"
        >
          Add Note
        </button>

        <div className="flex items-center">
          <span className="text-white mr-2">Current Role: {userRole}</span>
          <button
            onClick={toggleRole}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Switch to {username === "student" ? "Admin" : "Student"}
          </button>
        </div>
      </div>

      {showInput && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center z-50">
          <div className="animate__animated animate__fadeIn bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4 w-[90%] max-w-4xl md:flex-row">
            {/* Input Form */}
            <div className="flex flex-col gap-4 md:w-1/2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Your Notepad</span>
                <img
                  src={closeButton}
                  onClick={() => setShowInput(false)}
                  className="w-6 h-6 cursor-pointer hover:bg-gray-200 rounded-full"
                  alt="Close"
                />
              </div>
              <input
                type="text"
                maxLength="20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="border p-2 rounded"
              />
              <div className="text-right text-xs text-gray-400">
                {title.length}/20
              </div>
              <textarea
                maxLength="1024"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your message..."
                className="border p-2 rounded h-40 resize-none"
              />
              <div className="text-right text-xs text-gray-400">
                {content.length}/1024
              </div>
              <button
                onClick={addNote}
                className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>

            {/* Live Preview */}
            <div className="md:w-1/2 mt-6 md:mt-0 md:ml-6">
              <h3 className="text-gray-600 text-lg mb-2">Live Preview</h3>
              <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex flex-col min-h-[300px]">
                <h3 className="font-bold text-2xl truncate">
                  {title || "Untitled"}
                </h3>
                <div className="flex-grow mt-4 overflow-y-auto">
                  <p className="whitespace-pre-wrap break-words">
                    {content || "Your note content will appear here..."}
                  </p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <button className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-xs opacity-50">
                    Delete
                  </button>
                  <p className="italic text-gray-500 text-xs">- Anonymous</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col min-h-[300px] w-full">
          <h3 className="bungee-shade-regular text-red-900 font-bold text-2xl truncate">
            📌 Forum Rules
          </h3>
          <div className="flex-grow mt-4 overflow-y-auto">
            <div>
              <p className="bungee-regular">1. Be respectful</p>
              <p className="">
                No hate speech, harassment, or personal attacks.
              </p>
            </div>
            <div>
              <p className="bungee-regular">2. Stay on topic</p>
              <p className="">
                Post in the right category and keep it relevant.
              </p>
            </div>
            <div>
              <p className="bungee-regular">3. No spam or self-promotion</p>
              <p className="">Avoid ads or excessive linking.</p>
            </div>
            <div>
              <p className="bungee-regular">4. Use constructive language</p>
              <p className="">Be clear, respectful, and helpful.</p>
            </div>
            <div>
              <p className="bungee-regular">5. Respect privacy</p>
              <p className="">Do not share personal info (yours or others').</p>
            </div>
            <div>
              <p className="bungee-regular">6. Report issues</p>
              <p className="">Use the report feature, not retaliation.</p>
            </div>
            <div>
              <p className="bungee-regular">
                7. No illegal or explicit content
              </p>
              <p className="">
                This includes harmful, pirated, or adult content.
              </p>
            </div>
            <div>
              <p className="bungee-regular">8. Don’t abuse anonymity</p>
              <p className="">No trolling, impersonation, or manipulation.</p>
            </div>
            <div>
              <p className="bungee-regular">9. Respect moderation</p>
              <p className="">Rules apply equally; don’t try to evade them.</p>
            </div>
            <div>
              <p className="bungee-regular">10. Be welcoming</p>
              <p className="">Encourage others and contribute positively.</p>
            </div>
          </div>
        </div>
        {notes.map((note) => (
          <Stickynote
            key={note.id}
            note={note}
            onDelete={deleteNote}
            isAdmin={userRole === "admin"}
          />
        ))}
      </div>
    </div>
  );
}
