import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page py-32 text-center">
      <h1 className="section-heading">Page not found</h1>
      <p className="mt-3 text-navy-700/70">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Back to Home
      </Link>
    </div>
  );
}
