export const ClaimCard = ({ data }) => {
    return (
        <div className='max-[500px]:px-0 border rounded-xl p-6 bg-[#b39dd4] flex flex-col gap-3'>
            <div className='flex justify-between max-[500px]:flex-col text-center'>
                <p className='max-[500px]:text-sm'>Claim Name</p>
                <div className='flex gap-2 justify-center'>
                    <p className='max-[500px]:text-xs'>{data.claim_name}</p>
                </div>
            </div>
            <div className='flex justify-between max-[500px]:flex-col text-center'>
                <p className='max-[500px]:text-sm'>Claim expiration date</p>
                <div className='flex gap-2 justify-center'>
                    <p className='max-[500px]:text-xs'>{data.claim_expiration_date}</p>
                </div>
            </div>
            <div className='flex justify-between max-[500px]:flex-col text-center'>
                <p className='max-[500px]:text-sm'>Issue date</p>
                <div className='flex gap-2 justify-center'>
                    <p className='max-[500px]:text-xs'>{data.issue_date}</p>
                </div>
            </div>
            <div className='flex justify-between max-[500px]:flex-col text-center'>
                <p className='max-[500px]:text-sm'>Claim hash</p>
                <div className='flex gap-2 justify-center'>
                    <p className='max-[500px]:text-xs'>{data.claim_hash}</p>
                    <img src={require("../images/copy-icon.png")} alt=""></img>
                </div>
            </div>
            <div className='flex justify-between max-[500px]:flex-col text-center'>
                <p className='max-[500px]:text-sm'>Txn hash</p>
                <div className='flex gap-2 justify-center'>
                    <p className='max-[500px]:text-xs'>{data.txn_hash}</p>
                    <img src={require("../images/copy-icon.png")} alt=""></img>
                </div>
            </div>
        </div>
    )
}