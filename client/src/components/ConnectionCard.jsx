import React from 'react';

function ConnectionCard() {
  return (
    <div className="flex flex-col md:flex-row bg-white p-6 shadow-lg border border-gray-200 rounded-xl justify-center items-center max-w-4xl mx-auto">
      <div className="flex-1 flex flex-col justify-center text-center md:text-left p-4 md:p-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-3">Let's Connect on LinkedIn!</h2>
        <p className="text-gray-600 mb-6">
          Expand your professional network. We can share knowledge, ideas, and growth opportunities.
        </p>
        <a 
          href="https://www.linkedin.com/in/akashsingh3414/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white py-3 px-6 rounded-full transition duration-300 hover:bg-blue-600 shadow-md"
        >
          Connect on LinkedIn
        </a>
      </div>

      <div className="flex-shrink-0 p-4 md:p-6">
        <img 
          src="https://media.licdn.com/dms/image/v2/D5603AQGLS_BLsZOv-w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724617544361?e=1733961600&v=beta&t=sF2-AY08zwu1cfW7uETjjTgprfftnW9NLRvTtdDKthQ" 
          alt="Profile" 
          className="w-36 h-36 rounded-full border-4 border-blue-500 object-cover hover:scale-105 transition transform duration-300"
        />
      </div>
    </div>
  );
}

export default ConnectionCard;
