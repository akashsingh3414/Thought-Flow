import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Comment({ comment, postId, onDelete }) {
    const { currentUser } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.commentMessage);

    const handleEdit = () => {
        if (isEditing) {
            axios.patch(`/api/v1/post/comments/updateComment?postId=${postId}`, { 
                newComment: editedText,
                commentId: comment._id
            })
            .then(() => {
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating comment:', error);
            });
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = () => {
        axios.delete(`/api/v1/post/comments/deleteComment?postId=${postId}&commentId=${comment._id}`)
            .then(() => {
                onDelete(comment._id);
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 gap-2 w-full">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                    <Link to={`/profile?userName=${comment.userName}`} className="font-semibold text-blue-600 hover:underline">
                        @{comment.userName}
                    </Link>
                </span>
                {isEditing ? (
                    <input
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder="Edit your comment..."
                    />
                ) : (
                    <p className="text-gray-800">{comment.commentMessage}</p>
                )}
                <p className="text-xs text-gray-400">{moment(comment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            </div>
            {currentUser.user._id === comment.userId || currentUser.user.isAdmin && (
                <div className="flex items-center justify-end gap-1">
                    <button 
                        onClick={handleEdit}
                        className="bg-blue-500 h-5 text-md px-2 py-3 text-white flex justify-center items-center rounded-md hover:bg-blue-600"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="bg-red-500 h-5 text-md p-2 py-3 text-white flex justify-center items-center rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
