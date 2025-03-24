import Menu from "./Menu";

function TopBar() {
  return (
    <div className="container-fluid border">
      <div className="container p-3">
        <div className="row">
          <div className="col-4 border-end">
            <div className="row">
              <p className="col-6">
                NIFTY 50{" "}
                <span className="text-danger mx-2">
                  100.5% <i className="fa-solid fa-arrow-down"></i>
                </span>
              </p>

              <p className="col-6">
                SENSEX{" "}
                <span className="text-success mx-2">
                  140.5% <i className="fa-solid fa-arrow-up"></i>
                </span>
              </p>
            </div>
          </div>
          <div className="col-8">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
