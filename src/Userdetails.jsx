import React from 'react';

const UserDetails = ({ user }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div className="mb-2">
        <p>Name: {user.name}</p>
      </div>
      <div className="mb-2">
        <p>Email: {user.email}</p>
      </div>
      <div className="mb-2">
        <p>Contact: {user.number}</p>
      </div>
      <div className="mb-2">
        <p>Image: {user.imageUrl && <img src={user.imageUrl} alt={user.name} style={{ maxWidth: '200px' }} />}</p>
      </div>
      <div className="mb-2">
        <p>Created At: {user.createdAt && new Date(user.createdAt).toLocaleString()}</p>
      </div>

      {/* Add more details as needed */}
    </div>
  );
};

export default UserDetails;
