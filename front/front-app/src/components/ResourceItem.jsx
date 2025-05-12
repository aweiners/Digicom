import React from 'react';

export default function ResourceItem({ resource, isAdmin, onDelete }) {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-blue-800">{resource.title}</h3>
        {isAdmin && (
          <button
            onClick={() => onDelete(resource.id)}
            className="text-red-500 hover:text-red-700 text-sm flex items-center"
            aria-label="Delete resource"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
      <p className="mt-2 text-gray-700">{resource.description}</p>
      {resource.link && (
        <a 
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Resource
        </a>
      )}
      <p className="mt-3 text-xs text-gray-500">
        Added: {formatDate(resource.created_at)}
      </p>
    </div>
  );
}