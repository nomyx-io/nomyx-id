import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Input, Checkbox } from 'antd';
import ObjectList from './ObjectList';
import { useNavigate } from 'react-router-dom';

const IdentitiesPage = ({ service }) => {
    const navigate = useNavigate()
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

    const columns = [
        { label: "Identities", name: "identities", width: "20%" },
        { label: "Claims", name: "claims" },
        { label: "KUC ID Account #", name: "kyc_id" },
    ];

    const actions = [
        { label: "Add Claim", name: "add", confirmation: "You are about to do something. Do you wish to proceed?" },
        { label: "View", name: "view", confirmation: "You are about to do something. Do you wish to proceed?" },
        { label: "Remove", name: "remove", confirmation: "You are about to do something. Do you wish to proceed?" }
    ];
    const globalActions = [
        { label: "Create identity", name: "create" }
    ];

    const search = true;

    const data = [];

    for (let i = 1; i <= 200; i++) {
        data.push({
            identities: i,
            claims: "Object " + i,
            kyc_id: "Kyc" + i,
            status: "active"
        });
    };


    const handleAction = async (action, object) => {
        console.log(action, object);
        if (action == "view") {
            navigate('/identities/' + object.identities)
        }
    }

    return (
        <>
            <ObjectList
                title="Identities"
                description="Identities represent individuals that can be related to Claim Topics"
                columns={columns}
                actions={actions}
                globalActions={globalActions}
                search={search}
                data={data}
                pageSize={10}
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