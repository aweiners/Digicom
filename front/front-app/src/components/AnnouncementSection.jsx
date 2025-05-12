import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import AnnouncementItem from "./AnnouncementItem";

export default function AnnouncementSection({ userRole, authToken }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/announcements");
      const data = await response.json();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Add new announcement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAnnouncements();
        setTitle("");
        setContent("");
        setShowAddForm(false);
      } else {
        setError(data.error || "Failed to add announcement");
      }
    } catch (err) {
      console.error("Error adding announcement:", err);
      setError("Failed to add announcement");
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAnnouncements();
      } else {
        setError(data.error || "Failed to delete announcement");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Announcements</h2>
        {userRole === "admin" && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
          >
            {showAddForm ? "Cancel" : "Add Announcement"}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddAnnouncement} className="mb-6 bg-blue-50 p-4 rounded-lg shadow">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Save Announcement
            </button>
          </div>
        </form>
      )}

      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <AnnouncementItem 
                key={announcement.id}
                announcement={announcement}
                isAdmin={userRole === "admin"}
                onDelete={handleDeleteAnnouncement}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  );
}