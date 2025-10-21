import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
    </div>
  );
}
