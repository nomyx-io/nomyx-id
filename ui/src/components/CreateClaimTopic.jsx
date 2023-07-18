import { Button, Input } from 'antd'
import React from 'react'

function CreateClaimTopic() {
    const [displayName, setDisplayName] = React.useState('')
    const [hiddenName, setHiddenName] = React.useState('')
    return (
        <div >
            <p className='text-xl p-6'>Create Claim Topic</p>
            <hr></hr>
            <div className='p-6 mt-2'>
                <div>
                    <p>Claim Topic display name *</p>
                    <div className='mt-3 relative w-full flex border rounded-lg'>
                        <Input value={displayName} className='border w-full p-2 rounded-lg text-xl' placeholder='Base KYC' type='text' maxLength={32} onChange={(e) => setDisplayName(e.target.value)} />
                        <p className='absolute right-5 top-2'>{displayName.length}/32</p>
                    </div>
                    <p>User - friendly name that describe the schema. Shown to end-users.</p>
                </div>
                <div className='mt-10 mb-6'>
                    <p>TopicID hidden name *</p>
                    <div className='mt-3 relative w-full flex border rounded-lg'>
                        <Input value={hiddenName} className='border w-full p-2 rounded-lg text-xl' placeholder='1' type='text' maxLength={32} disabled style={{ backgroundColor: "white", cursor: "default" }} />
                        <p className='absolute right-5 top-2'>{hiddenName.length}/32</p>
                    </div>
                    <p>Only alphanumeric characters allowed and no spaces. Not seen by end users.</p>
                </div>
                <div className='flex justify-end max-[600px]:justify-center'>
                    <Button className='max-[600px]:w-[60%] min-w-max text-center font-semibold rounded h-11 bg-[#7F56D9] text-white'>Create Claim Topic</Button>
                </div>
            </div>
        </div>
    )
}

export default CreateClaimTopic