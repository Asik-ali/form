import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { fireDB, storage } from './firebase/Firebase';
import { doc, getDoc, addDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Addedit = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    photo: null,
    phoneNumber: '', // Add a new state variable for the phone number
  });

  const { name, email, photo, phoneNumber } = state; // Destructure the phone number from the state
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const detailsDocRef = doc(fireDB, 'Details', id);
      try {
        const docSnapshot = await getDoc(detailsDocRef);
        if (docSnapshot.exists()) {
          setState({ ...docSnapshot.data() });
        } else {
          setState({
            name: '',
            email: '',
            photo: null,
            phoneNumber: '', // Initialize the phone number in the state
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setState({ ...state, photo: e.target.files[0] });
    }
  };

  const uploadPhoto = async () => {
    try {
      const photoRef = ref(storage, `photos/${photo.name}`);
      await uploadBytes(photoRef, photo);
      const photoUrl = await getDownloadURL(photoRef);

      return photoUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !photo || !phoneNumber) {
      toast.error('Please fill in all details and upload a photo');
      return;
    }

    try {
      const timestamp = serverTimestamp();
      const photoUrl = await uploadPhoto();

      const detailsData = {
        name,
        email,
        photoUrl,
        phoneNumber,
        createdAt: timestamp,
      };

      if (id) {
        const detailsDocRef = doc(fireDB, 'Details', id);
        await updateDoc(detailsDocRef, detailsData);
        toast.success('Details Updated Successfully');
      } else {
        const newDocRef = await addDoc(collection(fireDB, 'Details'), detailsData);
        toast.success('Details Submitted Successfully');
        navigate(`/`);
      }

      localStorage.setItem('formSubmitted', 'true');
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      console.error('Error handling details:', error);
      toast.error('Error handling details');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen mt-32">
      <div className="bg-gray-800 px-10 py-10 rounded-xl">
        <div className="">
          <h1 className="text-center text-white text-xl mb-4 font-bold">Add Details</h1>
        </div>
        <div>
          <input
            type="text"
            value={name || ""}
            onChange={handleInput}
            name="name"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Enter Your Name"
          />
        </div>
        <div>
          <input
            type="email"
            value={email || ""}
            onChange={handleInput}
            name="email"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Enter Your Email"
          />
        </div>
        <div>
          <input
            type="text"
            value={phoneNumber || ""}
            onChange={handleInput}
            name="phoneNumber"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Enter Your Phone Number"
          />
        </div>
        <div>
          <input
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] text-white outline-none"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
          >
            {id ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addedit;
