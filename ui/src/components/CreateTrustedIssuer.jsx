import { Button, Input } from 'antd'
import React from 'react'
import { Transfer } from 'antd'

function CreateTrustedIssuer() {
    const [verifierName, setVerifierName] = React.useState('')
    const [walletAddress, setWalletAddress] = React.useState('')

    const mockData = Array.from({
        length: 5,
    }).map((_, i) => ({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
    }));
    const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

    const [targetKeys, setTargetKeys] = React.useState(initialTargetKeys);
    const [selectedKeys, setSelectedKeys] = React.useState([]);

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
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
                        <Input value={walletAddress} className='border w-full p-2 rounded-lg text-xl' placeholder='Wallet Address' type='text' maxLength={32} onChange={(e) => setWalletAddress(e.target.value)} />
                        <p className='absolute right-5 top-2'>{walletAddress.length}/32</p>
                    </div>
                    <p>Manage Claim Topic IDs</p>
                </div>
                <div className="flex flex-col items-center">
                    <div>
                        <div>Available Claims</div>
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
                <div className='flex justify-end max-[600px]:justify-center'>
                    <Button className='max-[600px]:w-[60%] min-w-max text-center font-semibold rounded h-11 bg-[#7F56D9] text-white'>Create Trusted Issuer</Button>
                </div>
            </div>
        </div>
    )
}

export default CreateTrustedIssuer