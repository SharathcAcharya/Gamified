// d:\Projects\Gamified\frontend\src\CommentChallenge.js
import React, { useState } from 'react';

function CommentChallenge() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(['This is a great challenge!', 'I\'m excited to participate.']); // Mock comments

  const handleSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() !== '') {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginBottom: '10px', color: '#333' }}>Comments ({comments.length})</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '8px', minHeight: '50px', resize: 'vertical' }}
        />
        <button type="submit" style={{ backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Post Comment</button>
      </form>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {comments.map((comment, index) => (
          <li key={index} style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#555' }}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

export default CommentChallenge;