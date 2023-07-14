import { Button, Input } from 'antd'
import React from 'react'

function DigitalIdentityDetailView() {
    const [displayName, setDisplayName] = React.useState('')

    const firstCardData = [
        { name: "Claim name", value: "Base KYC", icon: false },
        { name: "Claim expiration date", value: "30/07/2023", icon: false },
        { name: "Issue date", value: "09/07/2023", icon: false },
        { name: "Claim hash", value: "880bf326b5f662ba480ff48dc514631e", icon: true },
        { name: "Txn hash", value: "0x5A55456454688474656454DDBVS", icon: true }
    ]

    const secondCardData = [
        { name: "Claim name", value: "Accredited Investor", icon: false },
        { name: "Claim expiration date", value: "30/07/2023", icon: false },
        { name: "Issue date", value: "09/07/2023", icon: false },
        { name: "Claim hash", value: "980bf326b5f662ba480ff48dc661188", icon: true },
        { name: "Txn hash", value: "0x6A55456454688474656454DDRTQQA", icon: true }
    ]

    return (
        <div >
            <p className='text-xl p-6'>Identity Details</p>
            <hr></hr>
            <div className='p-6 max-[500px]:px-4 flex flex-col gap-4'>
                <div>
                    <p>Identity display name *</p>
                    <div className='mt-3 relative w-full flex'>
                        <Input className='w-full p-2 text-xl' placeholder='Base KYC' type='text' maxLength={32} onChange={(e) => setDisplayName(e.target.value)} />
                        <p className='absolute right-5 top-2'>{displayName.length}/32</p>
                    </div>
                </div>
                <div className='border rounded-xl p-6 bg-white flex flex-col gap-3 '>
                    <p>Investor Wallet Address</p>
                    <p className='font-light text-4xl max-[500px]:text-base text-gray-300'>0x5555aaadwerrasdw553</p>
                    <p>Investor KYC ID Provider Account Number</p>
                    <p className='font-light text-4xl max-[500px]:text-base text-gray-300'>007</p>
                </div>
                <p>Active Claims</p>
                <VioletCard data={firstCardData} />
                <VioletCard data={secondCardData} />
            </div>
            <div className='flex justify-end max-[500px]:justify-center'>
                <Button className='max-[500px]:w-[50%] rounded-none my-6 mr-6 h-11 px-10 bg-[#9952b3] text-white'>Back</Button>
            </div>
        </div>
    )
}

export const VioletCard = ({ data }) => {
    return (
        <div className='max-[500px]:px-0 border rounded-xl p-6 bg-[#b39dd4] flex flex-col gap-3'>
            {data.map((item) => {
                return (
                    <div className='flex justify-between max-[500px]:flex-col text-center'>
                        <p className='max-[500px]:text-sm'>{item.name}</p>
                        <div className='flex gap-2 justify-center'>
                            <p className='max-[500px]:text-xs'>{item.value}</p>
                            {item.icon && <img src={require("./copy-icon.png")} alt=""></img>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default DigitalIdentityDetailView
