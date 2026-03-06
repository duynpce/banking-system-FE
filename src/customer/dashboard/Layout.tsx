import { Link, Outlet, useLocation } from "react-router-dom";
import SearchBar from '../../shared/component/SearchBar';

const Layout = () => {
   const location = useLocation();
  
  const dashBoardName =  location.pathname.split("/")[2];
   return (
    <div className="grid grid-cols-12">

      <aside className="col-span-3 flex flex-col p-4 gap-4 border border-gray-300 text-gray-700">
        PDBankDashBoard
        <Link to="/dashboard/overview">Overview</Link>
        <Link to="/dashboard/transactions">Transactions</Link>
        <Link to="/dashboard/accounts">Accounts</Link>
        <Link to="/dashboard/cards">Cards</Link>
        <Link to="/dashboard/loans">Loans</Link>
        <Link to="/dashboard/service">Service</Link>
        <Link to="/dashboard/my-privileges">My Privileges</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>

      <section className="col-span-9 flex flex-col border border-gray-300">

        <header className="col-span-full grid grid-cols-12 h-20 content-center items-center">
          <h1 className="col-span-6 top-1/2 pl-4 text-3xl" >{dashBoardName}</h1>
          <SearchBar placeHolder="Search for something" className="col-span-3" />
          
        </header>

        <main className="flex-1 bg-gray-100 rounded-lg">
          <Outlet />
        </main>

      </section>
    </div>
  );
}

export default Layout;