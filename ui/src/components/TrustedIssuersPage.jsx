import React, { useState } from "react";
import { List, Button, Modal, Input, Checkbox, Form, InputNumber } from 'antd';

// Trusted Issuers Page
const TrustedIssuersPage = () => {
    const [trustedIssuers, setTrustedIssuers] = useState([{ id: 1, topics: [1, 2, 3] }, { id: 2, topics: [4, 5, 6] }]);
    const [selectedIssuer, setSelectedIssuer] = useState({});
    // modals visibility
    const [isVisible, setVisibility] = useState({ add: false, edit: false, remove: false });

    return (
        <div className='p-6'>
            <button className='py-2 px-4 bg-blue-600 text-white rounded mr-2'
                onClick={() => setVisibility({ ...isVisible, add: true })}>
                Add Trusted Issuer
            </button>
            <button className={`py-2 px-4 rounded ${Object.keys(selectedIssuer).length > 0 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-500'}`}
                onClick={() => setVisibility({ ...isVisible, remove: true })}
                disabled={!Object.keys(selectedIssuer).length}
            >
                Remove Trusted Issuer
            </button>
            <div className='mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {trustedIssuers.map(issuer =>
                    <TrustedIssuerListItem issuer={issuer} setSelectedIssuer={setSelectedIssuer} />
                )}
            </div>
            <AddTrustedIssuerDialog visible={isVisible.add} setVisibility={setVisibility} />
            <RemoveTrustedIssuerDialog visible={isVisible.remove} setVisibility={setVisibility} issuer={selectedIssuer} />
        </div>
    );
};


// Trusted Issuers List Item
const TrustedIssuerListItem = ({ issuer, setSelectedIssuer }) => (
    <div className='border border-gray-300 p-4 rounded-md flex items-center'>
        <input type='checkbox' className='mr-2' onChange={() => setSelectedIssuer(issuer)} />
        <span className='text-gray-700'>Trusted Issuer {issuer.id}</span>
    </div>
);


// Add Trusted Issuer Dialog
const AddTrustedIssuerDialog = (props) => {
    const { visible, setVisibility } = props;
    const [form] = Form.useForm();

    return (
        <Modal
            title="Add Trusted Issuer"
            visible={visible}
            onCancel={() => setVisibility({ add: false })}
            onOk={() => {
                form.validateFields().then(values => {
                    form.resetFields();
                    console.log(values);
                    setVisibility({ add: false });
                });
            }}
        >
            <Form
                form={form}
                name="addTrustedIssuerForm"
            >
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

// Remove Trusted Issuer Dialog
const RemoveTrustedIssuerDialog = (props) => {
    const { visible, setVisibility, issuer } = props;

    return (
        <Modal
            title="Remove Trusted Issuer"
            visible={visible}
            onCancel={() => setVisibility({ remove: false })}
            onOk={() => {
                console.log(`Trusted Issuer ${issuer.id} removed`);
                setVisibility({ remove: false });
            }}
        >
            Do you really want to remove Trusted Issuer {issuer.id}?
        </Modal>
    );
};

export default TrustedIssuersPage;