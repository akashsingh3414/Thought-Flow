import React from 'react';

function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Terms and Conditions</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Thought Flow! By accessing and using this platform, you agree to the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mb-2">1. Use of the Platform</h2>
      <p className="text-gray-600 mb-4">
        You may use Thought Flow for personal and non-commercial purposes only. You agree not to use the platform in any way that could damage, disable, or impair it.
      </p>

      <h2 className="text-xl font-semibold mb-2">2. User-Generated Content</h2>
      <p className="text-gray-600 mb-4">
        By posting content on Thought Flow, you grant us the right to display, modify, and distribute your content. You retain ownership of your content but are responsible for ensuring that it does not violate any laws or third-party rights.
      </p>

      <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
      <p className="text-gray-600 mb-4">
        All content on this platform, including text, graphics, and code, is owned by Thought Flow unless otherwise noted. You may not copy or reuse this content without our permission.
      </p>

      <h2 className="text-xl font-semibold mb-2">4. Prohibited Activities</h2>
      <p className="text-gray-600 mb-4">
        You agree not to engage in activities such as:
        <ul className="list-disc list-inside">
          <li>Posting unlawful, harmful, or offensive content.</li>
          <li>Attempting to hack, disrupt, or exploit the platform.</li>
          <li>Spamming or sending unauthorized advertisements.</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
      <p className="text-gray-600 mb-4">
        Thought Flow is provided on an "as is" basis. We do not guarantee the accuracy or reliability of the platform’s content. We are not liable for any damages that arise from the use of this platform.
      </p>

      <h2 className="text-xl font-semibold mb-2">6. Changes to the Terms</h2>
      <p className="text-gray-600 mb-4">
        We reserve the right to modify these terms at any time. You will be notified of any changes, and continued use of the platform will imply acceptance of the new terms.
      </p>

      <p className="text-gray-700">
        If you have any questions or concerns regarding this Privacy Policy, please contact us at 
        <span className="text-indigo-600 font-semibold text-lg ml-1">
            <a href="mailto:akashsingh3414@gmail.com" className="hover:underline">
                akashsingh3414@gmail.com
            </a>.
        </span>
      </p>
    </div>
  );
}

export default TermsAndConditions;
