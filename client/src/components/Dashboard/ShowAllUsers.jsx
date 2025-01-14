import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

export default function ShowAllUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async (startIndex = 0) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/v1/user/getUsers?startIndex=${startIndex}&limit=10`);
            if (res.status === 200) {
                setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
                setShowMore(res.data.users.length === 10);
            }
            if(res.status === 401 ) {
                dispatch(logoutStart())
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.user) {
            fetchUsers();
        } else {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleShowMore = () => {
        const startIndex = users.length;
        fetchUsers(startIndex);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await axios.delete(`/api/v1/user/delete?userId=${userId}`);
                if (res.status === 200) {
                    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                }
                if(res.status === 401 ) {
                    dispatch(logoutStart())
                }
            } catch (error) {
                setError(error.response ? error.response.data.message : error.message);
            }
        }
    };

    return (
        <div className="overflow-x-auto p-4">
            {loading ? (
                <div className="flex justify-center items-center h-screen bg-gray-100">
                    <ClipLoader color={"#3b82f6"} loading={loading} size={60} />
                    <p className="ml-4 text-lg text-gray-600">Loading users...</p>
                </div>
            ) : (
                <>
                    {error && <p className="text-red-500">{error}</p>}
                    {currentUser?.user?.isAdmin && users.length > 0 ? (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date Created</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Profile Photo</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User Name</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Full Name</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Admin</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Delete</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Edit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="bg-white hover:bg-gray-50">
                                            <td className="px-4 py-2 text-sm text-gray-700">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className='px-4 py-2'>
                                                <Link to={`/profile?userName=${user?.userName}`}>
                                                    {user?.profilePhoto ? (
                                                        <img
                                                            src={user.profilePhoto}
                                                            alt={user.userName || 'N/A'}
                                                            className='w-10 h-10 object-cover rounded-full'
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">No Image</span>
                                                    )}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link className="font-medium text-gray-900" to={`/profile?userName=${user?.userName}`}>
                                                    {user.userName}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link className="font-medium text-gray-900" to={`/profile?userName=${user?.userName}`}>
                                                    {user.fullName}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">{user.emailID}</td>
                                            <td className="px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="font-medium text-red-500 hover:underline cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link
                                                    to={`/dashboard?tab=updateUser&id=${user._id}`}
                                                    className="font-medium text-teal-500 hover:underline cursor-pointer"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {showMore && (
                                <button onClick={handleShowMore} className="mt-4 text-teal-500 self-center text-sm py-2">
                                    Show More
                                </button>
                            )}
                        </>
                    ) : (
                        <p>No users found.</p>
                    )}
                </>
            )}
        </div>
    );
}
