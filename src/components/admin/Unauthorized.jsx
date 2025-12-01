import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <section className="section-none py-5">
      <div className="container py-5 d-flex justify-content-center align-items-center vh-100">
        <div className="row position-fixed top=50 start-50 translate-middle">
          <div className="col">
            <div className="text-center not-found ">
              <div className="card border-0 shadow " style={{ width: "25rem" }}>
                <div className="card-body p-4">
                  <h2>⛔ Unauthorized!</h2>
                  <p>You don't have access to view this page</p>
                  <Link to="/" className="link">
                    Go Back Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
