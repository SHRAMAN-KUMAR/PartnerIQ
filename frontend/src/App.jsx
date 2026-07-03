import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AnalyzeCompany from './pages/AnalyzeCompany';
import ReportViewer from './pages/ReportViewer';
import SavedReports from './pages/SavedReports';
import { Briefcase, LayoutDashboard, FileText, Search } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">PartnerIQ</span>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/analyze"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Company
                  </Link>
                  <Link
                    to="/reports"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Saved Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analyze" element={<AnalyzeCompany />} />
            <Route path="/reports" element={<SavedReports />} />
            <Route path="/reports/:id" element={<ReportViewer />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Arizon Network. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
