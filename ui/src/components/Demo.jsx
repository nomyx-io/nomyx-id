import React from 'react';
import {CustomTable} from './Table';

const columns = [
	{key: 'name', label: 'Name', align: 'left', unique: true, sortable: true},
	{key: 'age', label: 'Age', align: 'center'},
	{key: 'email', label: 'Email', align: 'center',sortable:true},
	{
		key: 'action',
		label: 'Actions',
		align: 'right',
		render: (row) => (
			<div className="flex gap-4 items-center">
				<button
					className=" py-2 px-4 rounded-xl bg-purple-500 hover:bg-purple-700 text-white"
					onClick={() => console.log(row)}
				>
					Print
				</button>
				<button
					className=" py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-700 text-purple-500 hover:text-white"
					onClick={() => alert('hy')}
				>
					Alert
				</button>
			</div>
		),
	},
];
const columns2 = [
	{key: 'name', label: 'Name', align: 'left', unique: true},
	{key: 'age', label: 'Age', align: 'center'},
	{key: 'email', label: 'Email', align: 'right', sortable: true},
];

const columns3 = [
	{key: 'name', label: 'Name', align: 'left', unique: true},
	{key: 'age', label: 'Age', align: 'center'},
	{key: 'status', label: 'Status', align: 'center'},
	{key: 'email', label: 'Email', align: 'right', sortable: true},
];
const columns4 = [
	{key: 'name', label: 'Name', align: 'left', unique: true},
	{key: 'age', label: 'Age', align: 'center'},
	{key: 'status', label: 'Status', align: 'center'},
	{key: 'email', label: 'Email', align: 'center', sortable: true},
	{key: 'transactionStatus', label: 'Transaction Status', align: 'right', sortable: true},
];

const data = [
	{name: 'John Doe', age: 25, email: 'johndoe@example.com', status: 'Active', transactionStatus: 'Pending'},
	{name: 'John', age: 25, email: 'johndoe@example.com', status: 'Inactive', transactionStatus: 'Success'},
	{name: 'Jane Smith', age: 30, email: 'janesmith@example.com', status: 'Inactive', transactionStatus: 'Success'},
	{name: 'Bob Johnson', age: 40, email: 'bobjohnson@example.com', status: 'Inactive', transactionStatus: 'Pending'},
	{
		name: 'Alice Williams',
		age: 35,
		email: 'alicewilliams@example.com',
		status: 'Active',
		transactionStatus: 'Pending',
	},
];

const statusList = ['All', 'Active', 'Inactive'];
const TransactionStatusList = ['All', 'Success', 'Pending'];

const CustomTablePreview = () => {
	return (
		<div>
			<CustomTable title={'Custom Table Preview'} columns={columns} data={data} />
			<br />
			<br />
			<CustomTable title={'Table Preview With Search'} columns={columns2} data={data} searchable />
			<br />
			<br />
			<CustomTable
				title={'Table 3 With Tabs'}
				columns={columns3}
				data={data}
				enableTabs={true}
				statusList={statusList}
				enableTabsBy="status"
			/>
			<br />
			<br />
			<CustomTable
				title={'Table 4 With Tabs and Search'}
				columns={columns4}
				data={data}
				searchable
				enableTabs={true}
				statusList={TransactionStatusList}
				enableTabsBy="transactionStatus"
			/>
		</div>
	);
};

export default CustomTablePreview;
