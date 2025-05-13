export default function Stickynote({ note, onDelete, isAdmin }) {
  return (
    <div className="bg-yellow-100 text-justify p-6 rounded-lg shadow-md flex flex-col min-h-[300px] w-full">
      <h3 className="font-bold text-2xl truncate">{note.title || "Untitled"}</h3>
      <div className="flex-grow mt-4 overflow-y-auto">
        <p className="whitespace-pre-wrap break-words">{note.content}</p>
      </div>
      <div className="flex justify-between items-end mt-4">
        {isAdmin && (
          <button 
            onClick={() => onDelete(note.id)} 
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-xs"
          >
            Delete
          </button>
        )}
        {!isAdmin && (
          <div className="w-16"></div> /* Placeholder for spacing */
        )}
        <p className="italic text-gray-500 text-xs">- Anonymous</p>
      </div>
    </div>
  );
}