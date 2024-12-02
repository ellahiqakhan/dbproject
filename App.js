import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const App = () => {
  const [contactData, setContactData] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [alumniData, setAlumniData] = useState([]);
  const [meritListData, setMeritListData] = useState([]);
  const [feeStructureData, setFeeStructureData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [universityData, setUniversityData] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch('http://localhost:3000/contact'),
          fetch('http://localhost:3000/admission'),
          fetch('http://localhost:3000/alumni-group'),
          fetch('http://localhost:3000/merit-list'),
          fetch('http://localhost:3000/fee-structure'),
          fetch('http://localhost:3000/department'),
          fetch('http://localhost:3000/scholarship'),
          fetch('http://localhost:3000/university'),
        ]);

        const data = await Promise.all(responses.map((res) => res.json()));

        setContactData(data[0]);
        setAdmissionData(data[1]);
        setAlumniData(data[2]);
        setMeritListData(data[3]);
        setFeeStructureData(data[4]);
        setDepartmentData(data[5]);
        setScholarshipData(data[6]);
        setUniversityData(data[7]);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    const searchIdInt = parseInt(searchId, 10);
    try {
      const response = await fetch(`http://localhost:3000/university/${searchIdInt}`);
      if (!response.ok) {
        throw new Error('University not found');
      }
      const data = await response.json();
      setSearchResult(data);
      setSearchError(null);
    } catch (error) {
      setSearchResult(null);
      setSearchError(error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl">Error: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-semibold mb-8 text-center text-blue-600">UniVerse</h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-3xl mx-auto">
        <label htmlFor="searchId" className="block text-gray-700 font-semibold mb-2">Search University by ID:</label>
        <div className="flex gap-4">
          <input
            type="text"
            id="searchId"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out"
            placeholder="Enter University ID"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out"
          >
            Search
          </button>
        </div>
        {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
      </div>

      {/* Display Search Result */}
      {searchResult && (
        <div className="mb-8 border border-gray-300 rounded-lg p-6 bg-white shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Search Result</h2>
          <p><strong>ID:</strong> {searchResult?.university[0].ID}</p>
          <p><strong>Name:</strong> {searchResult?.university[0].Name}</p>

          {/* Contact Information */}
          <div className="mt-4">
            <h3 className="font-semibold">Contact Information</h3>
            {searchResult.contact.map((contact) => (
              <p key={contact.ID}><strong>Phone:</strong> {contact.Phone} | <strong>Email:</strong> {contact.Email || 'Not available'}</p>
            ))}
          </div>

          {/* Admission Details */}
          <div className="mt-4">
            <h3 className="font-semibold">Admission Details</h3>
            <p><a href={searchResult.admission[0].AdmissionDetailsURL} target="_blank" rel="noopener noreferrer" className="text-blue-500">Apply Now</a></p>
          </div>

          {/* Departments */}
          <div className="mt-4">
            <h3 className="font-semibold">Departments</h3>
            <ul>
              {searchResult.department.map((department) => (
                <li key={department.ID}>{department.Name}</li>
              ))}
            </ul>
          </div>

          {/* Scholarships */}
          <div className="mt-4">
            <h3 className="font-semibold">Scholarships</h3>
            <ul>
              {searchResult.scholarship.map((scholarship) => (
                <li key={scholarship.ID}>{scholarship.Details}</li>
              ))}
            </ul>
          </div>

          {/* Fee Structure */}
          <div className="mt-4">
            <h3 className="font-semibold">Fee Structure</h3>
            <p><a href={searchResult.feeStructure[0].FeeStructureURL} target="_blank" rel="noopener noreferrer" className="text-blue-500">Fee Structure Link</a></p>
          </div>

          {/* Merit List */}
          <div className="mt-4">
            <h3 className="font-semibold">Merit List</h3>
            <p><a href={searchResult.meritList[0].MeritListURL} target="_blank" rel="noopener noreferrer" className="text-blue-500">Merit List Link</a></p>
          </div>
        </div>
      )}

      {/* Data Tables */}
      <Table title="Contact Data" data={contactData} columns={['ID', 'Phone', 'Email']} />
      <Table title="Admission Data" data={admissionData} columns={['ID', 'Name', 'Course']} />
      <Table title="Alumni Group Data" data={alumniData} columns={['ID', 'Group Name', 'Number of Members']} />
      <Table title="Merit List Data" data={meritListData} columns={['ID', 'Name', 'URL']} />
      <Table title="Fee Structure Data" data={feeStructureData} columns={['ID', 'Program', 'Fee']} />
      <Table title="Department Data" data={departmentData} columns={['ID', 'Department Name', 'Head']} />
      <Table title="Scholarship Data" data={scholarshipData} columns={['ID', 'Scholarship Name', 'Amount']} />
      <Table title="University Data" data={universityData} columns={['ID', 'University Name', 'Location']} />
    </div>
  );
};

// Table component with improved styling
const Table = ({ title, data, columns }) => (
  <div className="mb-8 max-w-3xl mx-auto">
    <h2 className="text-xl font-semibold mb-4 text-blue-600">{title}</h2>
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 text-left font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`hover:bg-gray-100 ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex} className="border-t border-gray-300 px-6 py-3">{value}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-4 text-gray-500">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// PropTypes validation for the Table component
Table.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default App;
