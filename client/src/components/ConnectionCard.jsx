import React from 'react';

function ConnectionCard() {
  return (
    <div className="flex flex-col sm:flex-row p-4 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1 flex flex-col justify-center p-3">
        <h2 className="text-2xl font-semibold mb-2">Want to connect on LinkedIn?</h2>
        <p className="text-gray-500 mb-4">Let's connect and grow our professional network together.</p>
        <a 
          href="https://www.linkedin.com/in/akashsingh3414/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600 text-center"
        >
          Connect on LinkedIn
        </a>
      </div>
      <div className="p-3 flex justify-center">
        <img 
          src="https://media.licdn.com/dms/image/v2/D5603AQGLS_BLsZOv-w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724617544361?e=1733961600&v=beta&t=sF2-AY08zwu1cfW7uETjjTgprfftnW9NLRvTtdDKthQ" 
          alt="Machine Learning Illustration" 
          className="w-1/2 h-1/2 max-w-xs rounded-lg hover:scale-110 transition duration-4000"
        />
      </div>
    </div>
  );
}

export default ConnectionCard;
