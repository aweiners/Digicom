import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import ResourceItem from "./ResourceItem";

export default function ResourceSection({ userRole, authToken }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/resources");
      const data = await response.json();
      setResources(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // Load resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  // Add new resource
  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ title, description, link })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchResources();
        setTitle("");
        setDescription("");
        setLink("");
        setShowAddForm(false);
      } else {
        setError(data.error || "Failed to add resource");
      }
    } catch (err) {
      console.error("Error adding resource:", err);
      setError("Failed to add resource");
    }
  };

  // Delete resource
  const handleDeleteResource = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchResources();
      } else {
        setError(data.error || "Failed to delete resource");
      }
    } catch (err) {
      console.error("Error deleting resource:", err);
      setError("Failed to delete resource");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Resources</h2>
        {userRole === "admin" && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
          >
            {showAddForm ? "Cancel" : "Add Resource"}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddResource} className="mb-6 bg-blue-50 p-4 rounded-lg shadow">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
              Link (Optional)
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Save Resource
            </button>
          </div>
        </form>
      )}

      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : resources.length > 0 ? (
          <div className="space-y-4">
            {resources.map((resource) => (
              <ResourceItem 
                key={resource.id}
                resource={resource}
                isAdmin={userRole === "admin"}
                onDelete={handleDeleteResource}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No resources available yet.
          </div>
        )}
      </div>
    </div>
  );
}