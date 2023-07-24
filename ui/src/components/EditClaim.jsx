import React, {useState} from 'react';
import {Button, Input} from 'antd';
import {RightArrow} from './../Assets/icons';
import {Transfer} from 'antd';
const mockData = Array.from({
	length: 5,
}).map((_, i) => ({
	key: i.toString(),
	title: `content${i + 1}`,
	description: `description of content${i + 1}`,
}));
const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

const EditClaim = ({service}) => {
	const [verifierName, setVerifierName] = React.useState('');
	const [walletAddress, setWalletAddress] = React.useState('');
	const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
	const [selectedKeys, setSelectedKeys] = useState([]);

	const onChange = (nextTargetKeys, direction, moveKeys) => {
		setTargetKeys(nextTargetKeys);
	};
	const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	return (
		<div>
			<div className='text-2xl py-2'>Add Claim to Selected ID</div>
			<div className="flex flex-col items-center">
				<div>
				<div>Select Options</div>
				<Transfer
					showSelectAll={false}
					dataSource={mockData}
					titles={['Source', 'Target']}
					targetKeys={targetKeys}
					selectedKeys={selectedKeys}
					onChange={onChange}
					onSelectChange={onSelectChange}
					render={(item) => item.title}
				/>
				</div>
			</div>
			<br />
			<div className="p-6 border rounded-xl">
				<div>
					<p>Investor Name</p>
					<Input
						value={verifierName}
						className="border w-full p-2 rounded-lg text-xl"
						placeholder="HardCoded ID"
						type="text"
						disabled
						onChange={(e) => setVerifierName(e.target.value)}
					/>
				</div>

				<div className="my-3">
					<p>Investor KYC ID Provider Account Number</p>
					<Input
						value={walletAddress}
						className="border w-full p-2 rounded-lg text-xl"
						placeholder="HardCoded ID"
						type="text"
						disabled
						onChange={(e) => setWalletAddress(e.target.value)}
					/>
				</div>
				<div className="my-3">
					<p>Investor allet Address</p>
					<Input
						value={walletAddress}
						className="border w-full p-2 rounded-lg text-xl"
						placeholder="HardCoded ID"
						type="text"
						disabled
						onChange={(e) => setWalletAddress(e.target.value)}
					/>
				</div>
			</div>
			<br />
			<div className="flex justify-end gap-4">
				<Button className="flex items-center gap-2 min-w-max text-center font-semibold rounded-2xl p-2 h-fit bg-[#7F56D9] text-white">
					<div>Back</div>
					<RightArrow />
				</Button>
				<Button className="flex items-center gap-2 min-w-max text-center font-semibold rounded-2xl p-2 h-fit bg-[#7F56D9] text-white">
					<div>Save Claim</div>
					<RightArrow />
				</Button>
			</div>
		</div>
	);
};

export default EditClaim;
