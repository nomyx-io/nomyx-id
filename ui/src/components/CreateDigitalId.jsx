import { Button, Input } from 'antd'
import React from 'react'

function CreateDigitalId() {
    const [displayName, setDisplayName] = React.useState('')
    const [walletAddress, setWalletAddress] = React.useState('')
    const [accountNumber, setAccountNumber] = React.useState('')
    return (
        <div >
            <p className='text-xl p-6'>Create Digital Id</p>
            <hr></hr>
            <div className='p-6 mt-2'>
                <div>
                    <p>Identity display name *</p>
                    <div className='mt-3 relative w-full flex border rounded-lg'>
                        <Input value={displayName} className='border w-full p-2 rounded-lg text-xl' placeholder='Suzie Bignose' type='text' maxLength={32} onChange={(e) => setDisplayName(e.target.value)} />
                        <p className='absolute right-5 top-2'>{displayName.length}/32</p>
                    </div>
                    <p>User-friendly name that describes the trusted issuers.Shown to end-users</p>
                </div>
                <div className='mt-10 mb-6 w-[75%] max-[600px]:w-full border p-6 rounded-lg'>
                    <div>
                        <p>Investor Wallet Address</p>
                        <div className='mt-2 relative w-full flex border rounded-lg'>
                            <Input value={walletAddress} className='border w-full p-2 rounded-lg text-3xl' placeholder='Raw input' type='text' maxLength={32} onChange={(e) => setWalletAddress(e.target.value)} />
                        </div>
                    </div>
                    <div className='mt-6'>
                        <p>Investor KYC ID Provider Account Number</p>
                        <div className='mt-2 relative w-full flex border rounded-lg'>
                            <Input value={accountNumber} className='border w-full p-2 rounded-lg text-3xl' placeholder='Raw input' type='text' maxLength={32} onChange={(e) => setAccountNumber(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className='flex justify-end max-[600px]:justify-center'>
                    <Button className='max-[600px]:w-[60%] min-w-max text-center font-semibold rounded h-11 bg-[#7F56D9] text-white'>Create Digital Id</Button>
                </div>
            </div>
        </div>
    )
}

export default CreateDigitalId