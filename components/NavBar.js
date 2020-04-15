import React from 'react'
import Link from 'next/link'
import { useAuth } from '../lib/AuthContext'

const NavLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className='p-2 hover:underline hover:text-red-800'>{children}</a>
    </Link>
  )
}

const NavBar = () => {
  const auth = useAuth()
  return (
    <div className='bg-gray-500 py-4 text-center'>
      <NavLink href='/sobre'>Sobre</NavLink>
      {!auth.isAuth && <NavLink href='/cadastro'>Cadastro</NavLink>}
      {!auth.isAuth && <NavLink href='/entrar'>Entrar</NavLink>}
      {auth.isAuth && <NavLink href='/app'>Ver status</NavLink>}
      {auth.isAuth && (
        <NavLink href='/api/logout'>{auth.user.given_name} Sair</NavLink>
      )}
    </div>
  )
}
export default NavBar
