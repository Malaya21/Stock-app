import { Link } from "react-router-dom";
function Menu() {
    return ( <div className="row">
    <img src="vite.svg" className="col-1" alt="" />
    <ul className="nav col-11 justify-content-end">
  <li className="nav-item">
    <Link to='/'className="nav-link active" aria-current="page" >Dashboard</Link>
  </li>
  <li className="nav-item">
    <Link to='/orders'className="nav-link" >Orders</Link>
  </li>
  <li className="nav-item">
    <Link to='/holding'className="nav-link" >Holding</Link>
  </li>
  <li className="nav-item">
    <Link to='/position'className="nav-link" >Position</Link>
  </li>
 
  <li className="nav-item">
    <Link to='/fund'className="nav-link" >Fund</Link>
  </li>
  <li className="nav-item ml-3 fs-5 p-0  border">
    <Link to='/'className="nav-link user" ><i className="fa-solid fa-circle-user"></i> User</Link>
  </li>
</ul></div> );
}

export default Menu;