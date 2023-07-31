
import { useState, useEffect } from "react";
import { List, Button, Modal, Checkbox, Form, InputNumber } from 'antd';
import ObjectList from "./ObjectList";

const AddTrustedIssuerDialog = ({
    service,
    visible,
    setVisibility,
    addTrustedIssuer
}) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Add Trusted Issuer"
            visible={visible}
            onCancel={() => setVisibility({ add: false })}
            onOk={() => form
                .validateFields()
                .then(async (values) => {
                    form.resetFields();
                    await addTrustedIssuer(values.issuer, values.topics);
                    setVisibility({ add: false });
                })
            }
        >
            <Form form={form} name="addTrustedIssuerForm">
                <Form.Item
                    name="issuer"
                    label="Issuer"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the Issuer',
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="topics"
                    label="Claim Topics"
                    rules={[
                        {
                            required: true,
                            message: 'Please input one or more claim topics',
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const RemoveTrustedIssuerDialog = ({
    service,
    visible,
    setVisibility,
    issuer,
    removeTrustedIssuer
}) => {
    return (
        <Modal
            title="Remove Trusted Issuer"
            visible={visible}
            onCancel={() => setVisibility({ remove: false })}
            onOk={async () => {
                await removeTrustedIssuer(issuer.id);
                setVisibility({ remove: false });
            }}
        >
            Do you really want to remove Trusted Issuer {issuer.id}?
        </Modal>
    );
};

const TrustedIssuersPage = ({ service }) => {
    const [trustedIssuers, setTrustedIssuers] = useState([]);
    const [selectedIssuer, setSelectedIssuer] = useState({});
    // modals visibility
    const [isVisible, setVisibility] = useState({ add: false, edit: false, remove: false });

    useEffect(() => {
        async function fetchData() {
            const issuers = service.getTrustedIssuers && await service.getTrustedIssuers();
            let data = []
            if (issuers) {
                issuers.forEach((item) => {
                    const claimTopicsString = item.attributes?.claimTopics?.join(",");
                    data.push({ claimTopics: claimTopicsString, issuer: item.attributes.issuer })
                });
                console.log('issuers', data);
                setTrustedIssuers(data);
            }
        }

        fetchData();
    }, [service]);

    const addTrustedIssuer = async (issuer, claimTopics) => {
        await service.addTrustedIssuer(issuer, claimTopics);
    };

    const removeTrustedIssuer = async (issuer) => {
        await service.removeTrustedIssuer(issuer);
    };

    const columns = [
        { label: "Trusted Issuer", name: "issuer", width: "20%" },
        { label: "Managed Claim Topics", name: "claimTopics", width: "65%" },
    ];

    const actions = [
        { label: "Update Claim Topics", name: "update", confirmation: "You are about to do something. Do you wish to proceed?" },
        { label: "View IDs", name: "View", confirmation: "You are about to do something. Do you wish to proceed?" }
    ];
    const globalActions = [
        { label: "Create Trusted Issuer", name: "create" }
    ];

    const search = true;

    const handleAction = async (action, object) => {
        console.log(action, object);
    }

    return (
        <div className="p-6">
            <ObjectList
                title="Trusted Issuers"
                description="Trusted Issuers can create Digital Identities and add Claim Topics to them"
                columns={columns}
                actions={actions}
                globalActions={globalActions}
                search={search}
                data={trustedIssuers}
                pageSize={10}
                onAction={handleAction}
                onGlobalAction={handleAction}
            />
        </div>
    );
};

// Trusted Issuers List Item
const TrustedIssuerListItem = ({ issuer, setSelectedIssuer }) => (
    <List.Item className='border border-gray-300 p-4 rounded-md flex items-center'>
        <Checkbox className='mr-2' onChange={() => setSelectedIssuer(issuer)} />
        <span className='text-gray-700'>Trusted Issuer {issuer.id}</span>
    </List.Item>
);

export default TrustedIssuersPage;