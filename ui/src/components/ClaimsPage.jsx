import React, { useState } from 'react';

const ClaimsPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  
  return (
    <div className="bg-white text-gray-800">
      <button onClick={() => setShowAddDialog(true)} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Add Claim</button>
      <button onClick={() => setShowRemoveDialog(true)} className="bg-red-500 text-white px-4 py-2 rounded">Remove Claim</button>

      <ClaimsList />

      <AddClaimDialog visible={showAddDialog} onClose={() => setShowAddDialog(false)} />
      <RemoveClaimDialog visible={showRemoveDialog} onClose={() => setShowRemoveDialog(false)} />
    </div>
  );
};

export default ClaimsPage;

const AddClaimDialog = ({ visible, onClose }) => (
  <div className={`${visible ? '' : 'hidden'} absolute inset-0 flex items-center justify-center z-50`}>
    <div className="bg-white p-4 rounded shadow">
      <label className="block text-gray-700 text-sm font-bold mb-2" for="claim">Claim</label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your claim here" />
      <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded mt-4">Close</button>
    </div>
  </div>
);

const RemoveClaimDialog = ({ visible, onClose }) => (
  <div className={`${visible ? '' : 'hidden'} absolute inset-0 flex items-center justify-center z-50`}>
    Are you sure you want to remove the selected claims?
    <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" className="mr-2"/>Yes, I am sure</label>
    <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" className="mr-2"/>No, I changed my mind</label>
    
    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded mt-4">Close</button>
  </div>
);

const ClaimsList = () => {
  const claims = [
    {
      name: 'Claim 1',
    },
    {
      name: 'Claim 2',
    },
    // ... Add more claims data here
  ];

  return (
    <div className="mt-4">
      {claims.map(claim => <ClaimListItem claim={claim} />)}
    </div>
  );
};

const ClaimListItem = ({ claim }) => (
  <div className="bg-white p-4 rounded shadow mb-2 flex items-center">
    <input type="checkbox" className="mr-2" /><span className="text-gray-700">{claim.name}</span>
  </div>
);