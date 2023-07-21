import React from 'react'
import SideImage from '../images/loginimg.png'
import { Button, Input } from 'antd'

export default function Login() {
    const [id, setId] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        switch (name) {
            case "id":
                setId(value)
                break;
            case "password":
                setPassword(value)
                break;

            default:
                break;
        }
    }
    return (
        <div className='relative h-screen w-screen flex overflow-hidden p-0'>
            <div className='bg-[#8454a4] max-[550px]:hidden w-1/2 flex flex-col justify-center items-center gap-10'>
                <img height={"60%"} width={"50%"} src={SideImage} alt="" className='bg-[#8454a4]'></img>
                <div className='text-white text-center'>
                    <p className='font-bold text-xl mb-2'>IDify: Simplyfying Digital <br /> IDs</p>
                    <p className='font-semibold text-xs'>All your ID information in one place</p>
                </div>
            </div>
            <div className='relative max-[550px]:absolute max-[550px]:w-full w-1/2 flex flex-col p-5'>
                <p className='text-right font-bold text-xl'>LenderLab <br /> ID</p>
                <div className='flex flex-col justify-center items-center mt-14'>
                    <div className='flex flex-col gap-2 max-[768px]:w-[90%] w-[60%]'>
                        <div className='flex flex-col gap-4 p-0'>
                            <h3 className='font-bold text-xl'>Log in</h3>
                            <p>ID number</p>
                            <Input value={id} name="id" onChange={handleChange} className='border border-gray-500 rounded-none px-2 py-[6px]' placeholder='Enter ID number' />
                            <p>Password</p>
                            <Input value={password} name="password" onChange={handleChange} className='border border-gray-500 rounded-none px-2 py-[6px]' type='password' placeholder='*********' />
                        </div>
                        <Button className='border rounded-none h-11 border-gray-500 p-2 mt-2'>Log in</Button>
                        <p className='cursor-pointer'>Forgot your password?</p>
                        <Button className='mt-2 border font-semibold rounded-none h-11 border-gray-500 bg-[#8454a4] w-[100%] text-white'>Log in with Metamask</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

