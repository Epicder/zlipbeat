import React from 'react'
import './components-css/navbar.css'
import { Search } from 'lucide-react';

function Navbar() {
  return (
    <>
    <div className='container'>
        <div className='navbar'>
            <div className='logo'>
                <h1 className='logo-text'>ZlipBeat</h1>
            </div>
            <div className="search-container">
      <input type="text" className="search-bar" placeholder="Buscar" />
      <button className="search-button">
        <Search size={18} />
      </button>
    </div>
            <ul className='nav-list'>
                <li className='nav-item'><a href="/">New</a></li>
                <li className='nav-item'><a href="/">Trending</a></li>
                <li className='nav-item'>
                    <div className='user'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                    </div>
                </li>
            </ul>

        </div>
    </div>
    </>
  )
}

export default Navbar