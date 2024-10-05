import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ShowAllUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`/api/v1/user/getUser?limit=10`);
            if (res.status === 200) {
                setUsers(res.data.users);
                if (res.data.users.length < 10) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching users:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (currentUser?.user) {
            fetchUsers();
        } else {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await axios.get(`/api/v1/user/getUser?startIndex=${startIndex}&limit=10`);
            if (res.status === 200) {
                setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
                if (res.data.users.length < 10) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching more users:", error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const res = await axios.delete(`/api/v1/user/delete?userId=${userId}`);
            if (res.status === 200) {
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            } else {
                console.log(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="overflow-x-auto p-4">
            {currentUser?.user?.isAdmin && users.length > 0 ? (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date created</th>
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
                                    <td className="px-4 py-2">
                                        <Link to={`/user/${user.title}`}>
                                            <img
                                                src={user?.profilePhoto ? user.profilePhoto : ''}
                                                alt="Profile Photo"
                                                className="w-20 h-10 object-contain rounded-full"
                                            />
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link className="font-medium text-gray-900" to={`/user/${user?.userName}`}>
                                            {user.userName}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link className="font-medium text-gray-900" to={`/user/${user?.userName}`}>
                                            {user.fullName}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link className="font-medium text-gray-900" to={`/user/${user?.userName}`}>
                                            {user.emailID}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link className="font-medium text-gray-900" to={`/user/${user?.userName}`}>
                                            {user.isAdmin ? 'Yes' : 'No'}
                                        </Link>
                                    </td>
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
                                            to={`/dashboard?tab=update-user&id=${user._id}`}
                                            className="font-medium text-blue-500 hover:underline cursor-pointer"
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
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No user found</p>
            )}
        </div>
    );
}
