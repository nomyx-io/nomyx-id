
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
            const issuers = await service.getTrustedIssuers && service.getTrustedIssuers();
            setTrustedIssuers(issuers);
        }

        fetchData();
    }, [service]);

    const addTrustedIssuer = async (issuer, claimTopics) => {
        await service.addTrustedIssuer(issuer, claimTopics);
    };

    const removeTrustedIssuer = async (issuer) => {
        await service.removeTrustedIssuer(issuer);
    };[

    ]

    const columns = [
        {label:"Trusted Issuer", name:"id",width:"20%"},
        {label:"Managed Claim Topics", name:"claim_topics", width:"65%"},
      ];
    
      const actions = [
        // "view",
        {label:"Update Claim Topics", name:"update", confirmation:"You are about to do something. Do you wish to proceed?"},
        {label:"View IDs", name:"View", confirmation:"You are about to do something. Do you wish to proceed?"}
      ];
      const globalActions = [
        // {label:"Create Claim Topic", name:"create", confirmation:"You are about to do something. Do you wish to proceed?"}
        {label:"Create Trusted Issuer", name:"create"}
      ];
    
      const search = true;
    
      const data = [];
    
      for(let i=1; i<=200; i++){
        data.push({
          id: i,
          claim_topics: "Object " + i,
          description: "This is object " + i,
          status: "active"
        });
      };
    
    
      const handleAction = async (action, object) => {
        console.log(action, object);
        //create a claim topic
        // let claimTopicId = Math.round(Math.random()*10000000);
        // let response = await blockchainService.addClaimTopic(claimTopicId);
    
      }

    return (
		<div className="p-6">
			{/* <Button type='primary' onClick={() => setVisibility({ ...isVisible, add: true })}
                style={{
                    borderRadius: '5px',
                    backgroundColor: '#1a73e8',
                    color: '#fff',
                    border: '1px solid #1a73e8',
                    padding: '5px 15px',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '1.5',
                    letterSpacing: '.02857em',
                    cursor: 'pointer',
                    transition: 'background-color .218s,border-color .218s,box-shadow .218s',
                }}
            >
                Add Trusted Issuer
            </Button>
            <Button type='danger' style={{
                borderRadius: '5px',
                backgroundColor: '#1a73e8',
                marginLeft: '10px',
                color: '#fff',
                border: '1px solid #1a73e8',
                padding: '5px 15px',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1.5',
                letterSpacing: '.02857em',
                cursor: 'pointer',
                transition: 'background-color .218s,border-color .218s,box-shadow .218s',
            }}
                onClick={() => setVisibility({ ...isVisible, remove: true })} disabled={!Object.keys(selectedIssuer).length}>
                Remove Trusted Issuer
            </Button>
            <div className='mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {trustedIssuers && trustedIssuers.map(issuer =>
                    <TrustedIssuerListItem issuer={issuer} key={issuer.id}
                        setSelectedIssuer={setSelectedIssuer} />
                )}
            </div> 
            <AddTrustedIssuerDialog
                service={service}
                visible={isVisible.add}
                setVisibility={setVisibility}
                addTrustedIssuer={addTrustedIssuer}
            />
            <RemoveTrustedIssuerDialog
                service={service}
                visible={isVisible.remove}
                setVisibility={setVisibility}
                issuer={selectedIssuer}
                removeTrustedIssuer={removeTrustedIssuer}
            /> */}

			<ObjectList
				title="Trusted Issuers"
				description="Trusted Issuers can create Digital Identities and add Claim Topics to them"
				columns={columns}
				actions={actions}
				globalActions={globalActions}
				search={search}
				data={data}
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