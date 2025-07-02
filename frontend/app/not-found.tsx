import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center geometric-bg">
      <div className="card-modern p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-2 gradient-text">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the page you were looking for.</p>
        <Link href="/" className="btn-primary px-6 py-2 rounded font-semibold inline-block">Return Home</Link>
      </div>
    </div>
  );
}
