import React from 'react'
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
    return (
        <div className='flex items-center justify-between w-full'>
            <h2 className='font-bold text-2xl'>convert.wasm</h2>
            <a className='bg-purple-900 hover:bg-purple-700 text-white px-4 py-2 rounded-sm inline-flex items-center gap-2' href='https://github.com/anoopaneesh/convert.wasm' target='_blank'><FaGithub size={20} />
            <span className='hidden md:inline'>View Github</span></a>
        </div>
    )
}

export default Navbar