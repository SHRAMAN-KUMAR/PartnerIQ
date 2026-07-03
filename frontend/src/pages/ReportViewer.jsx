import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, AlertTriangle, CheckCircle, Info, Loader2, Target, Briefcase, TrendingUp, AlertOctagon } from 'lucide-react';

export default function ReportViewer() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/reports/${id}`);
        setReport(response.data);
        setReportData(JSON.parse(response.data.report_json));
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load report. It may not exist.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reports/${id}/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `partneriq_report_${report.company_name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getConfidenceColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getConfidenceIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />;
      case 'medium': return <Info className="w-5 h-5 text-amber-600 mr-2" />;
      case 'low': return <AlertTriangle className="w-5 h-5 text-rose-600 mr-2" />;
      default: return <Info className="w-5 h-5 text-slate-600 mr-2" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-slate-500">Loading report...</p>
      </div>
    );
  }

  if (errorMsg || !reportData) {
    return (
      <div className="p-6 rounded-md bg-red-50 border border-red-200 flex flex-col items-center max-w-2xl mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Report</h3>
        <p className="text-red-600 text-center mb-6">{errorMsg}</p>
        <Link to="/reports" className="secondary-button">Back to Reports</Link>
      </div>
    );
  }

  const {
    report_metadata,
    company_identity,
    business_profile,
    partnership_opportunities,
    partnership_readiness_assessment,
    confidence_assessment
  } = reportData;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link to="/reports" className="text-sm font-medium text-primary hover:underline mb-2 inline-block">
            &larr; Back to Reports
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">{report_metadata.company_name}</h1>
          {report_metadata.website_url && report_metadata.website_url !== "Not Provided" && (
            <a href={report_metadata.website_url.startsWith('http') ? report_metadata.website_url : `https://${report_metadata.website_url}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center mt-1">
              {report_metadata.website_url}
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Overall Score</span>
            <span className={`text-3xl font-bold ${partnership_readiness_assessment.overall_score >= 75 ? 'text-emerald-600' : partnership_readiness_assessment.overall_score >= 50 ? 'text-amber-500' : 'text-rose-600'}`}>
              {partnership_readiness_assessment.overall_score}/100
            </span>
          </div>
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="primary-button"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Confidence Model Warning (If Low/Medium) */}
      <div className={`p-5 rounded-lg border flex items-start ${getConfidenceColor(confidence_assessment.confidence_level)}`}>
        {getConfidenceIcon(confidence_assessment.confidence_level)}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">
            {confidence_assessment.confidence_level} Confidence Report
          </h3>
          <p className="text-sm opacity-90 mb-2">{confidence_assessment.reason}</p>
          {confidence_assessment.missing_information?.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-semibold uppercase opacity-75 block mb-1">Missing Information:</span>
              <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                {confidence_assessment.missing_information.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Business Profile */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="glass-card rounded-xl p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <Briefcase className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-xl font-bold text-slate-900">Business Profile</h2>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                {business_profile.business_summary}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-slate-900 border-b pb-2 mb-3">Industry</h4>
                  <p className="text-slate-700">{company_identity.industry}</p>
                  <p className="text-sm text-slate-500 mt-1">{company_identity.sub_industry}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 border-b pb-2 mb-3">Target Market</h4>
                  <p className="text-slate-700">{business_profile.target_market}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 border-b pb-2 mb-3">Products</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {business_profile.products?.length ? business_profile.products.map((p, i) => <li key={i}>{p}</li>) : <li>Not available</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 border-b pb-2 mb-3">Services</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {business_profile.services?.length ? business_profile.services.map((s, i) => <li key={i}>{s}</li>) : <li>Not available</li>}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-xl p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-xl font-bold text-slate-900">Partnership Opportunities</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Potential Value Drivers</h4>
                <ul className="space-y-2 text-slate-700">
                  {partnership_opportunities.potential_opportunities?.map((opp, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wider">Recommended Outreach Strategy</h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {partnership_opportunities.recommended_outreach_strategy}
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h5 className="font-semibold text-slate-800 text-sm mb-2">Suggested Decision Makers:</h5>
                  <div className="flex flex-wrap gap-2">
                    {partnership_opportunities.suggested_decision_maker_types?.map((role, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Right Column: Assessment & Signals */}
        <div className="space-y-8">
          
          <section className="glass-card rounded-xl p-6 border-t-4 border-t-primary">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Readiness Assessment</h2>
            
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Priority Level</span>
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-bold border ${partnership_readiness_assessment.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' : partnership_readiness_assessment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                {partnership_readiness_assessment.priority}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-emerald-700 flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 mr-1" /> Key Strengths
                </h4>
                <ul className="text-sm text-slate-700 space-y-1.5 pl-5 list-disc">
                  {partnership_readiness_assessment.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-rose-700 flex items-center mb-2">
                  <AlertOctagon className="w-4 h-4 mr-1" /> Potential Risks
                </h4>
                <ul className="text-sm text-slate-700 space-y-1.5 pl-5 list-disc">
                  {partnership_readiness_assessment.risks?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Analyst Recommendation:</span>
              {partnership_readiness_assessment.recommendation}
            </div>
          </section>

          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
              <h2 className="text-lg font-bold text-slate-900">Growth Signals</h2>
            </div>
            <ul className="space-y-3">
              {business_profile.growth_signals?.length ? business_profile.growth_signals.map((signal, i) => (
                <li key={i} className="flex items-start text-sm text-slate-700 bg-white p-3 rounded border border-slate-100 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>{signal}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-500 italic">No strong growth signals detected.</li>
              )}
            </ul>
          </section>
          
        </div>
      </div>
      
    </div>
  );
}
