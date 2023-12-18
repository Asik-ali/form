import React, { useEffect, useState, useMemo } from 'react';
import { fireDB } from './firebase/Firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import Modal from './Modal';
import ViewDetails from './ViewDetails';

const View = () => {
  const [data, setData] = useState({});
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSortOption, setSelectedSortOption] = useState('filter');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();

  const sortedData = useMemo(() => {
    const dataArray = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    return dataArray.sort((a, b) => {
      let valueA, valueB;

      if (sortedColumn === 'createdAt') {
        valueA = new Date(a[sortedColumn]) || 0;
        valueB = new Date(b[sortedColumn]) || 0;
      } else {
        valueA = (a[sortedColumn] || '').toLowerCase();
        valueB = (b[sortedColumn] || '').toLowerCase();
      }

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }, [data, sortedColumn, sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      const detailsCollection = collection(fireDB, 'Details');

      try {
        const querySnapshot = await getDocs(detailsCollection);
        const newData = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newData[doc.id] = {
            ...data,
            createdAt: data.createdAt?.toDate(),
            id: doc.id,
          };
        });

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    sessionStorage.setItem('user', JSON.stringify(user));

    const handleBeforeUnload = (event) => {
      sessionStorage.removeItem('user');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [fireDB, navigate, user]);

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this user?')) {
        const detailsRef = doc(fireDB, 'Details', id);
        await deleteDoc(detailsRef);

        toast.success('Delete Successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleSort = (columnName) => {
    setSortedColumn(columnName);
    setSortOrder(sortedColumn === columnName ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const handleSortOptionChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedSortOption(selectedOption);
    handleSort(selectedOption);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const totalEntries = Object.keys(data).length;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          'S.no',
          'Name',
          'Email',
          'Contact',
          'CreatedAt',
        ],
      ],
      body: sortedData.map((row, index) => [
        index + 1,
        row.name,
        row.email,
        row.phoneNumber,
        row.createdAt?.toLocaleString(),
      ]),
    });

    doc.save('user_data.pdf');
    toast.success('PDF Exported Successfully!');
  };

  return (
    <div className="p-4">
       <label htmlFor="sortDropdown" className="mr-2">
        Sort by:
      </label>
      <select id="sortDropdown" value={selectedSortOption} onChange={handleSortOptionChange} className="mb-4">
        <option value="filter">Filter</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="createdAt">Created At</option> 
      </select>
      <button onClick={handleLogout} className="bg-red-500 ms-5 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transform transition-transform hover:scale-110">
        Logout
      </button>

      <p className="mt-4">Total Entries: {totalEntries}</p>

      <div className='overflow-x-auto'>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border px-4 py-2 text-center sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">S.no</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('name')}>Name</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('email')}>Email</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" >Plan</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6">Contact</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6">Image 1</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6">Image 2</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('createdAt')}>Created At</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">{row.name}</td>
                <td className="border px-4 py-2 text-center">{row.email}</td>
                <td className="border px-4 py-2 text-center">{row.selectedPlan}</td>
                <td className="border px-4 py-2 text-center">{row.phoneNumber}</td>
                <td className="border px-4 py-2 text-center">
                  {row.fileUrls && row.fileUrls[0] && (
                    <img
                      src={row.fileUrls[0]}
                      alt={`${row.name}'s photo 1`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
                  {row.fileUrls && row.fileUrls[1] && (
                    <img
                      src={row.fileUrls[1]}
                      alt={`${row.name}'s photo 1`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 text-center">{row.createdAt?.toLocaleString()}</td>
                <td className="border px-4 py-2 text-center">
                  <Link to={`/fix/${row.id}`}>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2 transform transition-transform hover:scale-110">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="bg-red-500 hover:bg-red-700 ms-2 text-white font-bold py-1 px-2 rounded transform transition-transform hover:scale-110"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-2 mt-5 ">
        <button onClick={handleExportPDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transform transition-transform hover:scale-110 ml-2">
          Export PDF
        </button>
      </div>

      <Modal
        isOpen={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
        title="User Details"
        content={selectedUserId !== null && (
          <ViewDetails id={selectedUserId} />
        )}
      />
    </div>
  );
};

export default View;
