import React, { useEffect, useState } from 'react';
import Nav from '../components/nav';

const Profile = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchData = async () => {
      const [qRes, aRes] = await Promise.all([
        fetch(`${BACKEND_BASE_URL}/api/myQuestions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${BACKEND_BASE_URL}/api/myAnswers`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const [qData, aData] = await Promise.all([qRes.json(), aRes.json()]);
      setQuestions(qData);
      setAnswers(aData);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100">
      <Nav />
      <div className="max-w-6xl mx-auto p-10 mt-20">
        <h1 className="text-3xl font-bold mb-6">Welcome, {email.split('@')[0]}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">Your Posted Questions</h2>
            {questions.length === 0 ? <p>No questions yet.</p> : (
              <ul className="list-disc ml-5 space-y-2">
                {questions.map((q) => (
                  <li key={q._id} className="text-gray-700">{q.question}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Your Posted Answers</h2>
           {answers.length === 0 ? <p>No answers yet.</p> : (
  <ul className="space-y-4">
    {answers.map((a) => (
      <li key={a._id} className="text-gray-700">
        <div className="bg-pink-50 p-3 rounded-lg">
          <p className="font-semibold text-gray-800">{a.question?.question}</p>
          <div className="text-sm text-gray-500 mt-1">Rating: {a.rating?.toFixed(2) || 0}/5</div>
        </div>
      </li>
    ))}
  </ul>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
