import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fireDB } from './firebase/Firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

const ViewDetails = () => {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const openWhatsApp = () => {
    const phoneNumber = encodeURIComponent(user.phoneNumber);
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-800 px-10 py-10 rounded-xl text-white">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="mb-2">
          <p>Name: {user.name}</p>
        </div>
        {/* <div className="mb-2">
          <p>Email: {user.email}</p>
        </div> */}
        {/* Display the first photo */}
        <div className="mb-2">
          <p>Photo 1:</p>
          {user.fileUrls && (
            <img
              src={user.fileUrls[0]}
              alt={`${user.name}'s photo`}
              className="h-32 w-32 rounded-full object-cover object-center cursor-pointer"
              onClick={() => handleImageClick(user.fileUrls[0])}
            />
          )}
        </div>
        {/* Display the second photo */}
        <div className="mb-2">
          <p>Photo 2:</p>
          {user.fileUrls && (
            <img
              src={user.fileUrls[1]}
              alt={`${user.name}'s second photo`}
              className="h-32 w-32 rounded-full object-cover object-center cursor-pointer"
              onClick={() => handleImageClick(user.fileUrls[1])}
            />
          )}
        </div>
        {/* End of photo blocks */}
        <div className="mb-2">
          <p>Contact: {user.phoneNumber}</p>
        </div>
        <div className="mb-2">
          <p>plan: {user.selectedPlan}</p>
        </div>


        <div className="mt-4 text-center">
          <button
            onClick={openWhatsApp}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110"
          >
            Open WhatsApp
          </button>
        </div>
        {/* Add more details as needed */}

        {/* Back button to Home */}
        <div className="mt-4 text-center">
          <Link to="/view">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Modal for displaying full-screen image */}
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="absolute bg-gray-800 opacity-80 w-full h-full"></div>
            <div className="z-10 bg-white p-4 rounded-lg">
              <img
                src={selectedImage}
                alt="Full Screen"
                className="max-w-full max-h-full"
              />
              <button
                className="absolute top-2 right-2 text-white cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
