import { Link } from 'react-router-dom';

const NavBar = ({
  isConnected,
  connectBlockchain,
  disconnectBlockchain
}) => {
  const handleConnect = async () => {
    await connectBlockchain();
  };
  return (
    <nav className="bg-white text-black p-6">
      <ul className="flex space-x-6">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li className="hover:underline">
          <Link to="/topics">Claim Topics</Link>
          <ul className="space-y-2 mt-2">
            <li><Link to="/topics/add" className="hover:underline">Add new...</Link></li>
            <li><Link to="/topics" className="hover:underline">List</Link></li>
            <li><Link to="/topics/create" className="hover:underline">Create</Link></li>

          </ul>
        </li>
        <li className="hover:underline">
          <Link to="/claims">Claims</Link>
          <ul className="space-y-2 mt-2">
            <li><Link to="/claims/add" className="hover:underline">Add new...</Link></li>
            <li><Link to="/claims" className="hover:underline">List</Link></li>
          </ul>
        </li>
        <li className="hover:underline">
          <Link to="/identities">Identities</Link>
          <ul className="space-y-2 mt-2">
            <li><Link to="/identities/add" className="hover:underline">Add new...</Link></li>
            <li><Link to="/identities" className="hover:underline">List</Link></li>
            <li><Link to="/identities/{selectedId}" className="hover:underline">Detail Page</Link></li>
            <li><Link to="/identities/create" className="hover:underline">Create Digital Id</Link></li>
          </ul>
        </li>
        <li className="hover:underline">
          <Link to="/issuers">Trusted Issuers</Link>
          <ul className="space-y-2 mt-2">
            <li><Link to="/issuers/add" className="hover:underline">Add new...</Link></li>
            <li><Link to="/issuers/list" className="hover:underline">List</Link></li>
          </ul>
        </li>
        <li className="hover:underline" style={{ marginLeft: 'auto', display: isConnected ? 'none' : 'block' }}>
          <button onClick={handleConnect} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Connect</button>
        </li>
        <li className="hover:underline" style={{ marginLeft: 'auto', display: isConnected ? 'block' : 'none' }}>
          <button onClick={disconnectBlockchain} className="bg-red-500 text-white px-4 py-2 rounded mr-4">Disconnect</button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;