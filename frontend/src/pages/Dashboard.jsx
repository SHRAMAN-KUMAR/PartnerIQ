import { Link } from 'react-router-dom';
import { Search, FileText, ArrowRight, Activity, ShieldCheck, Target } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          AI-Powered Company Intelligence
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
          Instantly generate structured, professional intelligence reports for potential partnership opportunities. PartnerIQ analyzes companies so you can focus on making decisions.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/analyze" className="primary-button text-base px-6 py-3 h-auto group">
            <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Analyze a Company
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/reports" className="secondary-button text-base px-6 py-3 h-auto">
            <FileText className="w-5 h-5 mr-2" />
            View Reports
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 pb-12">
        <div className="glass-card p-8 rounded-xl text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Rapid Insights</h3>
          <p className="text-slate-600">
            Generate comprehensive business intelligence reports in minutes instead of hours.
          </p>
        </div>
        <div className="glass-card p-8 rounded-xl text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Intelligence</h3>
          <p className="text-slate-600">
            Clear distinction between verified facts and AI-inferred observations with our Confidence Model.
          </p>
        </div>
        <div className="glass-card p-8 rounded-xl text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Partnership Focus</h3>
          <p className="text-slate-600">
            Evaluations designed specifically for Arizon Network's partnership readiness criteria.
          </p>
        </div>
      </section>
    </div>
  );
}
