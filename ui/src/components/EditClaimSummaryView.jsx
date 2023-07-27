import React from 'react';
import {Button, Input} from 'antd';
import {CopyIcon, ShareIcon} from '../Assets/icons';
import {ClaimCard} from './ClaimCard';

const EditClaimSummaryView = ({service}) => {
	const [displayName, setDisplayName] = React.useState('https://etherscan/xyz');

	const ClaimData = [
		{
			claim_name: 'Base KYC',
			claim_expiration_date: '30/07/2023',
			issue_date: '09/07/2023',
			claim_hash: '880bf326b5f662ba480ff48dc514631e',
			txn_hash: '0x5A55456454688474656454DDBVS',
		},
	];

	return (
		<div>
			<div className="flex justify-between items-center  py-6">
				<p className="text-xl">Claim Link</p>
				<Button type="text" className="px-5 text-[#9952b3] flex gap-3 items-center">
					<ShareIcon /> Preview Link
				</Button>
			</div>
			<hr></hr>
			<div className="p-6 max-[500px]:px-4 flex flex-col gap-4">
				<div>
					<p>Link</p>
					<div className="mt-3 relative w-full flex">
						<Input
							id="link"
							className="w-full p-2 text-xl"
							placeholder="Base KYC"
							type="text"
							maxLength={32}
							onChange={(e) => setDisplayName(e.target.value)}
							value={displayName}
							suffix={<CopyIcon className="cursor-pointer" />}
							disabled
						/>
					</div>
				</div>
				<p>Details</p>
				{ClaimData.map((data) => (
					<ClaimCard data={data} />
				))}
			</div>
			<div className="flex justify-end max-[500px]:justify-center">
				<Button className="max-[500px]:w-[50%] rounded-lg my-6 mr-6 h-11 px-10 bg-[#9952b3] text-white">
					Done
				</Button>
			</div>
		</div>
	);
};

export default EditClaimSummaryView;
