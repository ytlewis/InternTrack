import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-2">Page Not Found</p>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
