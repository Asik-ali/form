import React, { useEffect, useState } from 'react';
import { fireDB } from './firebase/Firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BsSearch, BsX } from 'react-icons/bs';
import { CSVLink } from 'react-csv';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();

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
        setFilteredData(Object.keys(newData));
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
    const order =
      sortedColumn === columnName && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortedColumn(columnName);
    setSortOrder(order);

    const sortedData = Object.keys(data).sort((a, b) => {
      const valueA = data[a][columnName]?.toLowerCase() || '';
      const valueB = data[b][columnName]?.toLowerCase() || '';

      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    const newData = {};
    sortedData.forEach((key) => {
      newData[key] = data[key];
    });

    setData(newData);
    setFilteredData(Object.keys(newData));
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

  const handleSearch = () => {
    const filteredData = Object.keys(data).filter((id) => {
      const name = data[id]?.name?.toLowerCase() || '';
      return name.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filteredData);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredData(Object.keys(data));
  };

  useEffect(() => {
    setFilteredData(Object.keys(data));
  }, [data]);

  const totalEntries = filteredData.length;

  const handleExportCSV = () => {
    const csvData = [
      [
        'S.no',
        'Name',
        'Email',
        'Contact',
        'CreatedAt',
      ],
    ];

    filteredData.forEach((id, index) => {
      csvData.push([
        index + 1,
        data[id].name,
        data[id].email,
        data[id].contact,
        data[id].createdAt?.toLocaleString(),
      ]);
    });

    const csvFileName = 'user_data.csv';
    const csvDataExport = {
      data: csvData,
      filename: csvFileName,
      uFEFF: false,
    };

    return (
      <CSVLink {...csvDataExport} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transform transition-transform hover:scale-110 ml-2'>
        Export CSV
      </CSVLink>
    );
  };

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
      body: filteredData.map((id, index) => [
        index + 1,
        data[id].name,
        data[id].email,
        data[id].contact,
        data[id].createdAt?.toLocaleString(),
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
        <option value="rollno">Roll No</option>
        <option value="dob">DOB</option>
      </select>

      <button onClick={handleLogout} className="bg-red-500 ms-5 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transform transition-transform hover:scale-110">
        Logout
      </button>

      <p className="mt-4">Total Entries: {totalEntries}</p>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-2 py-1 border rounded"
        />
        {searchTerm && (
          <BsX
            className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            onClick={handleClearSearch}
          />
        )}
        <BsSearch
          className="absolute left-2 top-2 text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      <div className='overflow-x-auto'>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border px-4 py-2 text-center sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">S.no</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('name')}>Name</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('email')}>Email</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('contact')}>Contact</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6" onClick={() => handleSort('createdAt')}>Created At</th>
              <th className="border px-4 py-2 text-center sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((id, index) => (
              <tr key={id} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">{data[id].name}</td>
                <td className="border px-4 py-2 text-center">{data[id].email}</td>
                <td className="border px-4 py-2 text-center">{data[id].phoneNumber}</td>
                <td className="border px-4 py-2 text-center">
                  {data[id].imageUrl && (
                    <img
                      src={data[id].imageUrl}
                      alt={`${data[id].name}'s photo`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 text-center">{data[id].createdAt?.toLocaleString()}</td>
                <td className="border px-4 py-2 text-center">
                  <Link to={`/fix/${id}`}>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2 transform transition-transform hover:scale-110">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(id)}
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
        {handleExportCSV()}
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

      <div className="flex justify-center items-center mt-5">
        <Link to={`/add`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transform transition-transform hover:scale-110">
            Add
          </button>
        </Link>
      </div>
    </div>
  );
};

export default View;
