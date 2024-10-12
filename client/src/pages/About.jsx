import React from 'react';

function About() {
  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-50 dark:bg-slate-800'>
      <div className='max-w-2xl mx-auto p-6'>
        <h1 className='text-4xl font-semibold text-gray-800 dark:text-white text-center mb-8'>
          About Thought Flow
        </h1>
        <div className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-6'>
          <p>
            Thought Flow was created in 2024 as a platform to share ideas on topics like technology, creativity, and personal growth. Our goal is to inspire, educate, and connect with readers who are open to exploring new perspectives.
          </p>

          <p>
            This space offers articles and discussions on a variety of subjects, aiming to spark meaningful conversations and thoughtful engagement.
          </p>

          <p>
            Thought Flow is created by <strong>Akash Singh</strong>, a pre-final year student at IIIT Manipur, with a passion for technology and community-driven discussions.
          </p>
          <p className="text-gray-700">
            Please contact me at 
            <span className="text-indigo-600 font-semibold text-lg ml-1">
                <a href="mailto:akashsingh3414@gmail.com" className="hover:underline">
                    akashsingh3414@gmail.com
                </a>.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
