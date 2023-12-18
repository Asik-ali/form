    import React, { useEffect, useState } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { fireDB } from './firebase/Firebase';
    import { collection, doc, getDoc } from 'firebase/firestore';

   // ... (previous imports)

const ViewDetails = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailsCollection = collection(fireDB, 'Details');
        const userDoc = doc(detailsCollection, id);
        const snapshot = await getDoc(userDoc);

        if (snapshot.exists()) {
          setUser({ ...snapshot.data() });
        } else {
          setUser({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-800 px-10 py-10 rounded-xl text-white">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="mb-2">
          <p>Name: {user.name}</p>
        </div>
        <div className="mb-2">
          <p>Email: {user.email}</p>
        </div>
        {/* Display the first photo */}
        <div className="mb-2">
          <p>Photo 1:</p>
          {user.imageUrl && <img src={user.imageUrl} alt={`${user.name}'s photo`} className="h-32 w-32 rounded-full object-cover" />}
        </div>
        {/* Display the second photo */}
        <div className="mb-2">
          <p>Photo 2:</p>
          {user.imageUrl2 && <img src={user.imageUrl2} alt={`${user.name}'s second photo`} className="h-32 w-32 rounded-full object-cover" />}
        </div>
        {/* End of photo blocks */}
        <div className="mb-2">
          <p>Contact: {user.phoneNumber}</p>
        </div>
        
        {/* Add more details as needed */}

        {/* Back button to Home */}
        <div className="mt-4 text-center">
          <Link to="/">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
