import { Link } from "react-router-dom";
import Layout from "../common/Layout";

export default function NotFoundPage() {
  return (
    <section className="section-none py-5">
      <div className="container py-5 d-flex justify-content-center align-items-center vh-100">
        <div className="row position-fixed top=50 start-50 translate-middle">
          <div className="col-md-4">
            <div className="text-center not-found">
              <div className="card border-0 shadow" style={{ width: "25rem" }}>
                <div className="card-body p-4">
                  <h1>404</h1>
                  <p>👻 Oops! The page you are looking for does not exist.</p>
                  <Link to="/" className="link">
                    Back to Home
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
