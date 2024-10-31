import { useState, useEffect } from 'react';

const BlogLikes = ({ blog }) => {
  const [likeCount, setLikeCount] = useState(blog.like_count);
  const [isLiked, setIsLiked] = useState(blog.is_liked);
  const [isLiking, setIsLiking] = useState(false);

  // Get CSRF token if using Django's CSRF protection
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      const response = await fetch(`https://kgt.inventoryr.online/api/blogs/${blog.id}/toggle_like/`, {
        method: 'POST',
       
        credentials: 'include', // Important for sessions
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || '', // If using CSRF
        },
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      
      const data = await response.json();
      setLikeCount(data.like_count);
      setIsLiked(data.status === 'liked');
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
<div>
  <button 
    onClick={handleLike}
    disabled={isLiking}
    className={`like-button ${isLiked ? 'liked' : ''}`}
  >
    {isLiked ? '❤️ Unlike' : '🤍 Like'} ({likeCount})
  </button>
</div>

  );
};

export default BlogLikes;