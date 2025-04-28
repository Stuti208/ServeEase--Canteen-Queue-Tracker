import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'


const CustomLink = ({ children, to }) => {

  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
	  <div>
		  <Link className={match?'text-white':'text-gray-300'} to={to}>
			  {children}
		  </Link>
	   
	</div>
  )
}

export default CustomLink
