// d:\Projects\Gamified\frontend\src\LikeChallenge.js
import React, { useState } from 'react';

function LikeChallenge() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(10); // Mock likes

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <button onClick={handleLike} style={{ backgroundColor: '#e9ecef', color: '#007bff', border: '1px solid #007bff', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginRight: '10px' }}>
        {liked ? 'Unlike' : 'Like'}
      </button>
      <span>{likes} likes</span>
    </div>
  );
}

export default LikeChallenge;