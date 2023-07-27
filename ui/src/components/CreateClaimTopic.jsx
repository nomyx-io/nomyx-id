import { Button, Input } from 'antd'
import React from 'react'

let addedAddListener = false;

function CreateClaimTopic({service}) {
    const [displayName, setDisplayName] = React.useState('');
    const [hiddenName, setHiddenName] = React.useState('');


    //fixme: displayName doesn't get updated after first call
    const updateClaimTopic = async (claimTopic) => {

        console.log('updateClaimTopic');
        console.log('claimTopic = ' + claimTopic);
        console.log('displayName = ' + displayName);

        const result = await service.updateClaimTopic(
            {
                topic: claimTopic+"",
                displayName: displayName
            }
        );

        console.log('updateClaimTopic result:');
        console.log(result);
    };

    const saveClaimTopic = async () => {
      console.log('saveClaimTopic');

        if(!addedAddListener){

            console.log('adding listener');

            service.onClaimTopicAdded(async (claimTopic) => {

                console.log('onClaimTopicAdded!');
                console.log(claimTopic.toNumber());
                updateClaimTopic(claimTopic.toNumber());

            });

            addedAddListener = true;
        }

        let result = await service.addClaimTopic(hiddenName);

        console.log('addClaimTopic result:');
        console.log(result);
    };

    //todo: useEffect to get next id from server


    return (
        <div >
            <p className='text-xl p-6'>Create Claim Topic</p>
            <hr></hr>
            <div className='p-3 mt-2'>
                <div>
                    <p>Claim Topic display name *</p>
                    <div className='mt-3 ml-1 relative w-full flex border rounded-lg p-0'>
                        <Input value={displayName} className='border w-full p-2 rounded-lg text-xl' placeholder='Base KYC' type='text' maxLength={32} onChange={(e) => setDisplayName(e.target.value)} />
                        <p className='absolute right-5 top-2'>{displayName.length}/32</p>
                    </div>
                    <p>User - friendly name that describe the schema. Shown to end-users.</p>
                </div>
                <div className='mt-10 mb-6'>
                    <p>TopicID hidden name *</p>
                    <div className='mt-3 ml-1 relative w-full flex border rounded-lg p-0'>
                        <Input value={hiddenName} className='border w-full p-2 rounded-lg text-xl' placeholder='1' type='text' maxLength={32} style={{ backgroundColor: "white", cursor: "default" }}  onChange={(e) => setHiddenName(e.target.value)}  />
                        <p className='absolute right-5 top-2'>{hiddenName.length}/32</p>
                    </div>
                    <p>Only alphanumeric characters allowed and no spaces. Not seen by end users.</p>
                </div>
                <div className='flex justify-end max-[600px]:justify-center'>
                    <Button className='max-[600px]:w-[60%] min-w-max text-center font-semibold rounded h-11 bg-[#7F56D9] text-white' onClick={saveClaimTopic}>Create Claim Topic</Button>
                </div>
            </div>
        </div>
    )
}

export default CreateClaimTopic