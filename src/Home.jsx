import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fireDB, storage } from './firebase/Firebase';
import { doc, getDoc, addDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Addedit = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    photo: null,
    phoneNumber: '',
    selectedPlan: 'plan',
    fileInputs: Array.from({ length: 2 }, (_, i) => `File ${i + 1}`),
  });
  const [loading, setLoading] = useState(false); // New state for loading indicator
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
            phoneNumber: '',
            selectedPlan: '590',
            fileInputs: Array.from({ length: 2 }, (_, i) => `File ${i + 1}`),
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
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setState((prevState) => ({ ...prevState, photo: e.target.files[0] }));
    }
  };

  const handlePlanChange = (e) => {
    const { value } = e.target;
    const numFileInputs = value === '1000' ? 2 : 1;
    setState((prevState) => ({
      ...prevState,
      selectedPlan: value,
      fileInputs: Array.from({ length: numFileInputs }, (_, i) => `File ${i + 1}`),
    }));
  };

  const handleFileInputChange = (index, e) => {
    const newFileInputs = [...state.fileInputs];
    newFileInputs[index] = e.target.files[0];
    setState((prevState) => ({ ...prevState, fileInputs: newFileInputs }));
  };

  const uploadPhoto = async () => {
    try {
      if (state.photo) {
        const photoRef = ref(storage, `photos/${state.photo.name}`);
        await uploadBytes(photoRef, state.photo);
        return await getDownloadURL(photoRef);
      } else {
        return null; // Return null if there is no photo
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const uploadFiles = async () => {
    try {
      const fileUrls = await Promise.all(
        state.fileInputs.map(async (file, index) => {
          if (file) {
            const fileRef = ref(storage, `files/${id || 'new'}/file${index + 1}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
          }
          return null;
        })
      );
      return fileUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!state.name || !state.email || !state.phoneNumber || state.fileInputs.some((file) => !file)) {
      toast.error('Please fill in all details and upload files');
      return;
    }
  
    try {
      setLoading(true);
  
      const timestamp = serverTimestamp();
      const photoUrl = await uploadPhoto();
      const fileUrls = await uploadFiles();
  
      const detailsData = {
        name: state.name,
        email: state.email,
        photoUrl,
        phoneNumber: state.phoneNumber,
        fileUrls,
        selectedPlan: state.selectedPlan, // Include selected plan in detailsData
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
  
      setState({
        name: '',
        email: '',
        photo: null,
        phoneNumber: '',
        selectedPlan: 'plan',
        fileInputs: Array.from({ length: 2 }, (_, i) => `File ${i + 1}`),
      });
  
      localStorage.setItem('formSubmitted', 'true');
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      console.error('Error handling details:', error);
      toast.error('Error handling details');
    } finally {
      setLoading(false);
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
            value={state.name || ''}
            onChange={handleInput}
            name="name"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Enter Your Name"
          />
        </div>
        <div>
          <input
            type="email"
            value={state.email || ''}
            onChange={handleInput}
            name="email"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Enter Your Email"
          />
        </div>
        <div>
          <input
            type="text"
            value={state.phoneNumber || ''}
            onChange={handleInput}
            name="phoneNumber"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Enter Your Phone Number"
          />
        </div>

        <div>
          <label className="text-white">Select Plan:</label>
          <select
            name="selectedPlan"
            value={state.selectedPlan}
            onChange={handlePlanChange}
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white outline-none"
          >
            <option value="">Plan</option>
            <option value="590">590 Plan</option>
            <option value="1000">1000 Plan</option>
          </select>
        </div>

        {/* Display file input fields */}
        {state.fileInputs.map((fileInput, index) => (
          <div key={index}>
            <label className="text-white">{`File ${index + 1}:`}</label>
            <input
              type="file"
              onChange={(e) => handleFileInputChange(index, e)}
              className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] text-white outline-none"
            />
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
            disabled={loading} // Disable the button during submission
          >
            {loading ? 'Submitting...' : id ? 'Update' : 'Save'}
          </button>
        </div>
        <Link to={`/login`}>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2 transform transition-transform hover:scale-110">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Addedit;
