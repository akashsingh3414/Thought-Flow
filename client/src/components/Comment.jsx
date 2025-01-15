import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Comment({ comment, postId, onDelete, onEdit, postAuthorId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.commentMessage);

    const handleEdit = async () => {
        if (isEditing) {
            try {
                const response = await axios.patch(`/api/v1/post/comments/updateComment?postId=${postId}`, {
                    newComment: editedText,
                    commentId: comment._id,
                });

                setIsEditing(false);
                if (onEdit) {
                    onEdit(comment._id, response.data.comment);
                }
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/v1/post/comments/deleteComment`, {
                params: { postId, commentId: comment._id },
            });
            if (onDelete) {
                onDelete(comment._id);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 gap-2 w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <Link
                        to={`/profile?userName=${comment.userName}`}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        @{comment.userName}
                    </Link>
                    <p className="text-xs text-gray-400">
                        {moment(comment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </p>
                </div>
                <div className="flex flex-grow">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholder="Edit your comment..."
                        />
                    ) : (
                        <p className="text-gray-800">{comment.commentMessage}</p>
                    )}
                </div>
            </div>
            {(currentUser?.user?._id === comment.userId ||
                currentUser?.user?._id === postAuthorId ||
                currentUser?.user?.isAdmin) && (
                <div className="flex items-center justify-end gap-1 mt-2">
                    <button
                        onClick={handleEdit}
                        className={`h-5 text-md px-3 py-1 text-white flex justify-center items-center rounded-md ${
                            isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 h-5 text-md px-3 py-1 text-white flex justify-center items-center rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
