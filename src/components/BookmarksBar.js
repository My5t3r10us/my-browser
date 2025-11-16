import React from 'react';
import { Globe } from 'lucide-react';
import useBrowserStore from '../store/browserStore';

const BookmarksBar = () => {
  const { bookmarks, navigateTo } = useBrowserStore();
  
  const handleBookmarkClick = (url) => {
    navigateTo(url);
  };
  
  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-bar">
        <span style={{ fontSize: '12px', color: '#999' }}>
          No bookmarks yet. Click the star icon to add bookmarks.
        </span>
      </div>
    );
  }
  
  return (
    <div className="bookmarks-bar">
      {bookmarks.map(bookmark => (
        <div
          key={bookmark.id}
          className="bookmark-item"
          onClick={() => handleBookmarkClick(bookmark.url)}
          title={bookmark.url}
        >
          <Globe size={14} className="bookmark-favicon" />
          <span>{bookmark.title.substring(0, 20)}{bookmark.title.length > 20 ? '...' : ''}</span>
        </div>
      ))}
    </div>
  );
};

export default BookmarksBar;
