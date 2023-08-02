import { Button, Input } from 'antd';
import React, { useEffect } from 'react';
import { Transfer } from 'antd';
import { useNavigate } from 'react-router-dom';
let addedAddListener = false;

function CreateTrustedIssuer({ service }) {
	const navigate = useNavigate()
	const [verifierName, setVerifierName] = React.useState('');
	const [walletAddress, setWalletAddress] = React.useState('');
	const [claimTopics, setClaimTopics] = React.useState([]);

	const [targetKeys, setTargetKeys] = React.useState([]);
	const [selectedKeys, setSelectedKeys] = React.useState([]);


	const onChange = (nextTargetKeys, direction, moveKeys) => {
		setTargetKeys(nextTargetKeys);
	};
	const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	useEffect(() => {
		(async function () {
			const result = await service.getClaimTopics();
			let data = []
			if (result) {
				result.forEach((item) => {
					data.push({ key: item.attributes.topic, displayName: item.attributes.displayName, id: item.id, topic: item.attributes.topic })
				});
				console.log('result', data);
				setClaimTopics(data);
			}
		})();
	}, [service]);

	const updateTrustedIssuer = async (trustedIssuer, claimTopics) => {
		console.log('updateTrustedIssuer', trustedIssuer, claimTopics);
		const result = await service.updateTrustedIssuer({
			verifierName: verifierName,
			claimTopics: targetKeys,
			issuer: trustedIssuer
		});
		console.log('updateTrustedIssuer result:', result);
		navigate('/issuers')
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
			let result = await service.addTrustedIssuer(walletAddress, targetKeys);
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
				<Transfer
					showSelectAll={false}
					dataSource={claimTopics}
					titles={['Available Claims', 'Selected Claims']}
					targetKeys={targetKeys}
					selectedKeys={selectedKeys}
					onChange={onChange}
					onSelectChange={onSelectChange}
					render={(item) => <div>{item?.displayName}({item.topic})</div>}
				/>
				<br />
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

export default CreateTrustedIssuer