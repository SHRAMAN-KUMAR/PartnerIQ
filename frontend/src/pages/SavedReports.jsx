import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Download, Calendar, Activity, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function SavedReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/reports');
        setReports(response.data);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load reports. Ensure the backend server is running.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-slate-500">Loading reports...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-6 rounded-md bg-red-50 border border-red-200 flex flex-col items-center max-w-2xl mx-auto mt-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Reports</h3>
        <p className="text-red-600 text-center">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Reports</h1>
          <p className="text-slate-600">View and download previously generated company intelligence reports.</p>
        </div>
        <Link to="/analyze" className="primary-button">
          New Analysis
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-12 rounded-xl text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">No reports yet</h3>
          <p className="text-slate-500 mb-6">You haven't generated any company reports yet.</p>
          <Link to="/analyze" className="primary-button">
            Analyze Your First Company
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Link 
              key={report.id} 
              to={`/reports/${report.id}`}
              className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block group border border-slate-200 hover:border-primary/30"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                  {report.company_name}
                </h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityColor(report.priority)}`}>
                  {report.priority} Priority
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(report.created_at)}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Activity className="w-4 h-4 mr-2" />
                  Score: <span className={`ml-1 font-bold ${getScoreColor(report.overall_score)}`}>{report.overall_score}/100</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-primary">
                View Report
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
