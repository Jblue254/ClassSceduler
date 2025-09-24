import React, { useState } from "react";

export default function ClassScheduler() {
  const [classes, setClasses] = useState([]);
  const [role, setRole] = useState("teacher");

  const addClass = (title, description, schedule) => {
    const newClass = {
      id: Date.now(),
      title,
      description,
      schedule,
      attendees: [],
      feedback: [],
    };
    setClasses([...classes, newClass]);
  };

  const enrollStudent = (classId, name, email) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? { ...cls, attendees: [...cls.attendees, { name, email }] }
          : cls
      )
    );
  };

  const addFeedback = (classId, email, rating, comments) => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== classId) return cls;
        const attendee = cls.attendees.find((a) => a.email === email);
        if (!attendee) return cls; 
        return {
          ...cls,
          feedback: [...cls.feedback, { attendee, rating, comments }],
        };
      })
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Scheduler</h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="teacher">Teacher View</option>
          <option value="student">Student View</option>
        </select>
      </div>

      {role === "teacher" ? (
        <TeacherDashboard
          classes={classes}
          onAddClass={addClass}
        />
      ) : (
        <StudentDashboard
          classes={classes}
          onEnroll={enrollStudent}
          onAddFeedback={addFeedback}
        />
      )}
    </div>
  );
}

function TeacherDashboard({ classes, onAddClass }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !schedule) return;
    onAddClass(title, description, schedule);
    setTitle("");
    setDescription("");
    setSchedule("");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded-lg shadow-sm space-y-2"
      >
        <h2 className="text-lg font-semibold">Add Class</h2>
        <input
          className="border p-2 w-full rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border p-2 w-full rounded"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">My Classes</h2>
      {classes.length === 0 && <p>No classes scheduled.</p>}
      <ul className="space-y-4">
        {classes.map((cls) => (
          <li key={cls.id} className="p-3 border rounded">
            <h3 className="font-bold">{cls.title}</h3>
            <p>{cls.description}</p>
            <p className="text-sm text-gray-600"> {cls.schedule}</p>
            <p className="mt-2 font-semibold">Attendees:</p>
            <ul className="list-disc ml-5">
              {cls.attendees.map((a, i) => (
                <li key={i}>
                  {a.name} ({a.email})
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">Feedback:</p>
            <ul className="list-disc ml-5">
              {cls.feedback.map((f, i) => (
                <li key={i}>
                  {f.attendee.name}: {f.rating}/5 - {f.comments}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudentDashboard({ classes, onEnroll, onAddFeedback }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Available Classes</h2>
      {classes.length === 0 && <p>No classes available.</p>}
      <ul className="space-y-4">
        {classes.map((cls) => (
          <li key={cls.id} className="p-3 border rounded">
            <h3 className="font-bold">{cls.title}</h3>
            <p>{cls.description}</p>
            <p className="text-sm text-gray-600"> {cls.schedule}</p>

            
            <form
              className="mt-2 flex space-x-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name || !email) return;
                onEnroll(cls.id, name, email);
                setSelectedClass(cls.id);
              }}
            >
              <input
                className="border p-1 rounded flex-1"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border p-1 rounded flex-1"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="bg-green-600 text-white px-3 rounded">
                Enroll
              </button>
            </form>

            {/* Feedback form (only after enrolled) */}
            {selectedClass === cls.id && (
              <form
                className="mt-3 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!rating) return;
                  onAddFeedback(cls.id, email, rating, comments);
                  setRating("");
                  setComments("");
                }}
              >
                <input
                  className="border p-1 rounded w-full"
                  placeholder="Rating (1-5)"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
                <input
                  className="border p-1 rounded w-full"
                  placeholder="Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <button className="bg-purple-600 text-white px-3 py-1 rounded">
                  Submit Feedback
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
