import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
  
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const user = resultsFromGoogle.user;
      dispatch(loginStart());
  
      const res = await axios.post('/api/v1/user/google', {
          userName: user.displayName,
          emailID: user.email,
          googlePhotoUrl: user.photoURL,
        }, {
          headers: { 'Content-Type': 'application/json' }
      });
    
      if (res.status === 200) {
        dispatch(loginSuccess(res.data));
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        dispatch(loginFailure(error.response.data.message))
      } else {
        dispatch(loginFailure(error.response))
      }
    }
  };
  

  return (
    <button
      type='button'
      className='border-2 border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-6 rounded-lg'
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  );
}
