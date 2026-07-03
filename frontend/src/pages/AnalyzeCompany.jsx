import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Building2, Globe, Loader2, AlertCircle } from 'lucide-react';

export default function AnalyzeCompany() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reports/analyze', {
        company_name: data.companyName,
        website_url: data.websiteUrl || null
      });
      navigate(`/reports/${response.data.id}`);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "An unexpected error occurred while analyzing the company.";
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analyze Company</h1>
        <p className="text-slate-600">Enter company details to generate a comprehensive AI intelligence report.</p>
      </div>

      <div className="glass-card p-8 rounded-xl">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="companyName"
                type="text"
                className={`input-field pl-10 ${errors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g. Acme Corp"
                {...register("companyName", { required: "Company Name is required" })}
                disabled={isLoading}
              />
            </div>
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-700 mb-1">
              Website URL <span className="text-slate-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="websiteUrl"
                type="text"
                className="input-field pl-10"
                placeholder="e.g. acmecorp.com"
                {...register("websiteUrl", { 
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    message: "Please enter a valid URL"
                  }
                })}
                disabled={isLoading}
              />
            </div>
            {errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.websiteUrl.message}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Providing a website URL significantly improves the accuracy of the generated report by allowing the AI to analyze current, verified public information.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="primary-button min-w-[180px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {isLoading && (
        <div className="mt-8 text-center text-sm text-slate-500 animate-pulse">
          <p>Please wait. Our AI Analyst is collecting data and generating the report...</p>
          <p className="mt-1">This may take up to a minute.</p>
        </div>
      )}
    </div>
  );
}
