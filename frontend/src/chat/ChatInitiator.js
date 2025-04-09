import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsersList from './UsersList';

const ChatInitiator = ({ currentUserId }) => {
  const navigate = useNavigate();

  const handleSelectUser = (selectedUser) => {
    navigate(`/profile/${selectedUser._id}`); // Перенаправлення на профіль
  };

  return (
    <div>
      <UsersList onSelectUser={handleSelectUser} currentUserId={currentUserId} />
    </div>
  );
};

export default ChatInitiator;