import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Input, Checkbox } from 'antd';
import ObjectList from './ObjectList';

const IdentitiesPage = ({ service }) => {
    const [identities, setIdentities] = useState([]);
    const [selectedIdentities, setSelectedIdentities] = useState([]);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const [isRemoveDialogVisible, setIsRemoveDialogVisible] = useState(false);

    useEffect(() => {
        const fetchIdentities = async () => {
            const identities = await service.getRegistryUsers();
            setIdentities(identities);
        };

        // fetchIdentities();
    }, [service]);

    const handleAddIdentity = async (identity) => {
        // Add the identity through your contract here
        // upon success, update the identities state
        const signer = service.provider.getSigner();
        const identityData = {}; // set up the identityData object as per your requirement
        await service.addIdentity(signer, identity, identityData);
        const newIdentities = await service.getRegistryUsers();
        setIdentities(newIdentities);
    };

    const handleRemoveIdentity = async () => {
        // Remove the selected identities through your contract here
        // upon success, update the identities state
        const signer = service.provider.getSigner();
        for (const identity of selectedIdentities) {
            await service.removeIdentity(signer, identity);
        }
        const newIdentities = await service.getRegistryUsers();
        setIdentities(newIdentities);
        setSelectedIdentities([]);
    };

    const tabs = [
		{
			id: 'all',
			name: 'All',
			filter: [
				{
					key: 'status',
					value: ['active', 'inactive'],
				},
			],
		},
		{id: 'active', name: 'Active'},
		{id: 'inactive', name: 'Inactive'},
	];
	const columns = ['identity', 'claims','KUC ID Account#'];
	const actions = [
		{
			id: 'Add',
			name: 'Add Claim',
			onClick: (object) => {
				console.log('View', object);
			},
		},
		{
			id: 'remove',
			name: 'Remove',
			onClick: (object) => {
				console.log('View', object);
			},
		},
        {
			id: 'View',
			name: 'View',
			onClick: (object) => {
				console.log('View', object);
			},
		},
	];
	const globalActions = ['create'];

	const search = true;

	const children = [
		{
			'identity': 'Object 1',
			'claims': '1',
            'KUC ID Account#':'2112',
			status: 'active',
			tabs: ['all', 'active'],
		},
		{
			'identity': 'Object 2',
			'claims': '2',
            'KUC ID Account#':'2112',
			status: 'inactive',
			tabs: ['all', 'inactive'],
		},
		{
			'identity': 'Object 3',
			'claims': '3',
            'KUC ID Account#':'2112',
			status: 'active',
			tabs: ['all', 'active'],
		},
		{
			'identity': 'Object 4',
			'claims': '4',
            'KUC ID Account#':'2112',
			status: 'inactive',
			tabs: ['all', 'inactive'],
		},
		{
			'identity': 'Object 5',
			'claims': '5',
            'KUC ID Account#':'2112',
			status: 'active',
			tabs: ['all', 'active'],
		},
	];
	const handleAction = (action, object) => {
		console.log(action, object);
	};

    return (
        <>
            {/* Update the Button components to use tailwindcss classes */}
            {/* <Button className="mb-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setIsAddDialogVisible(true)}>Add Identity</Button>
            <Button className={`mb-4 py-2 px-4 rounded ${selectedIdentities.length === 0 ? 'bg-gray-200' : 'bg-red-500 text-white'}`} onClick={() => setIsRemoveDialogVisible(true)} disabled={selectedIdentities.length === 0}>Remove Identity</Button>
            <AddIdentityDialog visible={isAddDialogVisible} onAddIdentity={handleAddIdentity} onCancel={() => setIsAddDialogVisible(false)} />
            <RemoveIdentityDialog visible={isRemoveDialogVisible} onRemoveIdentity={handleRemoveIdentity} onCancel={() => setIsRemoveDialogVisible(false)} />
            <IdentitiesList
                identities={identities}
                selectedIdentities={selectedIdentities}
                onSelectedIdentitiesChange={(selected) => setSelectedIdentities(selected)}
            /> */}
            <ObjectList
                title="Identities"
                tabs={tabs}
                columns={columns}
                actions={actions}
                globalActions={globalActions}
                search={search}
                children={children}
                onAction={handleAction}
                onGlobalAction={handleAction}
            />
        </>
    );
};


const IdentitiesList = ({ identities = [], selectedIdentities, onSelectedIdentitiesChange }) => (
    <List
        dataSource={identities}
        renderItem={(item) => <IdentityListItem identity={item} isSelected={selectedIdentities.includes(item)} onSelect={onSelectedIdentitiesChange} />}
    />
);

const IdentityListItem = ({ identity, isSelected, onSelect }) => (
    <List.Item className="border rounded mb-4 p-2 flex items-center">
        <Checkbox className="mr-4" checked={isSelected} onChange={() => onSelect(identity)} />
        {identity}
    </List.Item>
);

const AddIdentityDialog = ({ visible, onAddIdentity, onCancel }) => {
    const [value, setValue] = useState('');
    return (
        <Modal title="Add Identity" visible={visible} onCancel={onCancel} footer={null}>
            <Input className="p-2 mb-4 border rounded" value={value} onChange={(e) => setValue(e.target.value)} />
            <Button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => onAddIdentity(value)}>Ok</Button>
            <Button className="ml-4 py-2 px-4 rounded bg-gray-500 text-white" onClick={onCancel}>Cancel</Button>
        </Modal>
    );
};

const RemoveIdentityDialog = ({ visible, onRemoveIdentity, onCancel }) => (
    <Modal title="Confirm Removal" visible={visible} onCancel={onCancel} footer={null}>
        Are you sure you want to remove the selected identities?
        <div className="mt-4">
            <Button className="bg-red-500 text-white py-2 px-4 rounded" onClick={onRemoveIdentity}>Remove</Button>
            <Button className="ml-4 py-2 px-4 rounded bg-gray-500 text-white" onClick={onCancel}>Cancel</Button>
        </div>
    </Modal>
);

export default IdentitiesPage;