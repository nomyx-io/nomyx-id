import { Button, Input } from 'antd';
import React, { useEffect } from 'react';
import { Transfer } from 'antd';
let addedAddListener = false;

function CreateTrustedIssuer({ service }) {
	const [verifierName, setVerifierName] = React.useState('');
	const [walletAddress, setWalletAddress] = React.useState('');
	const [claimTopics, setClaimTopics] = React.useState([]);
	const [selectedChips, setSelectedChips] = React.useState([]);

	const handleChipClick = (label) => {
		if (selectedChips.includes(label)) {
			setSelectedChips(selectedChips.filter((chip) => chip !== label));
		} else {
			setSelectedChips([...selectedChips, label]);
		}
	};

	useEffect(() => {
		(async function () {
			const result = await service.getClaimTopics();
			console.log('result', result);
			setClaimTopics(result);
		})();
	}, [service]);

	const updateTrustedIssuer = async (trustedIssuer, claimTopics) => {
		console.log('updateTrustedIssuer', trustedIssuer, claimTopics);
		const result = await service.updateTrustedIssuer({
			verifierName: verifierName,
			claimTopics: selectedChips,
			issuer: trustedIssuer
		});
		console.log('updateTrustedIssuer result:', result);
	};

	const saveTrustedIssuer = async () => {
		try {
			console.log('saveTrustedIssuer');
			if (!addedAddListener) {
				console.log('adding listener');
				service.onTrustedIssuerAdded(async (trustedIssuer, claimTopics) => {
					console.log('onTrustedIssuerAdded!');
					updateTrustedIssuer(trustedIssuer, claimTopics);
				});
				addedAddListener = true;
			}
			let result = await service.addTrustedIssuer(walletAddress, selectedChips);
			console.log('addTrustedIssuer result:', result);
		} catch (error) {
			console.log("Error in adding trusted issuer", error);
		}
	};

	return (
		<div >
			<p className='text-xl p-6'>Create Trusted Issuer</p>
			<hr></hr>
			<div className='p-6 mt-2'>
				<div>
					<p>Trusted Issuer display name *</p>
					<div className='mt-3 relative w-full flex border rounded-lg'>
						<Input value={verifierName} className='border w-full p-2 rounded-lg text-xl' placeholder='ID Verifier Name' type='text' maxLength={32} onChange={(e) => setVerifierName(e.target.value)} />
						<p className='absolute right-5 top-2'>{verifierName.length}/32</p>
					</div>
				</div>
				<div className='mt-10 mb-6'>
					<p>Trusted Issuer Wallet *</p>
					<div className='mt-3 relative w-full flex border rounded-lg'>
						<Input value={walletAddress} className='border w-full p-2 rounded-lg text-xl' placeholder='Wallet Address' type='text' onChange={(e) => setWalletAddress(e.target.value)} />
					</div>
					<p className='my-4'>Manage Claim Topic IDs</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{claimTopics &&
						claimTopics.length > 0 &&
						claimTopics.map((chip) => (
							chip.attributes?.displayName && <Chip
								key={chip.id}
								label={chip.attributes?.displayName}
								selected={selectedChips.includes(chip.attributes?.topic)}
								onClick={() => handleChipClick(chip.attributes?.topic)}
							/>
						))}
				</div>
				<div className="flex justify-end max-[600px]:justify-center">
					<Button
						className="max-[600px]:w-[60%] min-w-max text-center font-semibold rounded h-11 bg-[#7F56D9] text-white"
						onClick={saveTrustedIssuer}
					>
						Create Trusted Issuer
					</Button>
				</div>
			</div>
		</div>
	);
}
const Chip = ({ label, selected, onClick }) => {
	return (
		<button
			className={`px-4 py-2 rounded-full ${selected ? 'bg-[#7F56D9] text-white' : 'bg-gray-300 text-gray-700'}`}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default CreateTrustedIssuer