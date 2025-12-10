import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import menuData from '../data.json'; 
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Header = () => {
  const { restaurantName, categories } = menuData;

  return (
    <div>    
          {/* Header */}
      <h1 className="text-4xl md:text-6xl font-bold text-center bg-amber-200 p-4 mb-6 rounded shadow">
        {restaurantName}
      </h1>

      {/* Category Nav */}
      <nav className="flex items-center sticky justify-between top-0 bg-white px-2 py-2 z-10 shadow-sm">
        <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="bg-amber-200 px-4 py-2 rounded hover:bg-amber-300 text-sm font-medium"
          >
            {cat.name}
          </a>
          ))}

        </div>
<div className="text-xl text-green-700 cursor-pointer hover:text-green-900 transition">
  <Link href="./Cart.tsx">
  <FontAwesomeIcon icon={faCartPlus} className="mr-2 text-black text-2xl  hover:text-green-700" />
  </Link>
</div>

      </nav></div>
  )
}

export default Header