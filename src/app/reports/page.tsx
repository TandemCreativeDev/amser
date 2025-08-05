"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ReportsData {
  summary: {
    totalDuration: number;
    formattedTotalTime: string;
    billableTime: string;
    totalEarnings: number;
    avgRate: number;
    entryCount: number;
  };
  breakdown: Array<{
    id: string;
    name: string;
    colour: string | null;
    duration: number;
    formattedDuration: string;
    earnings: number;
    avgRate: number;
    entryCount: number;
    percentage: number;
  }>;
  dateRange: {
    start: string;
    end: string;
    range: string;
  };
  groupBy: string;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState("week");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [groupBy, setGroupBy] = useState("project");
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    if (!session?.user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        dateRange,
        groupBy,
      });
      
      if (selectedProject !== "all") {
        params.append("projectId", selectedProject);
      }
      
      if (selectedClient !== "all") {
        params.append("clientId", selectedClient);
      }
      
      const response = await fetch(`/api/reports?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      
      const data = await response.json();
      setReportsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchReports();
    }
  }, [session, dateRange, selectedProject, selectedClient, groupBy]);

  if (!session?.user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Please sign in to view reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-base-content/70">
          Analyse your time tracking data and export reports
        </p>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 mb-6">
        <div className="card-body">
          <div className="flex flex-wrap gap-4">
            <div className="form-control">
              <label className="label" htmlFor="dateRange">
                <span className="label-text">Date Range</span>
              </label>
              <select
                id="dateRange"
                className="select select-bordered"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="project">
                <span className="label-text">Project</span>
              </label>
              <select
                id="project"
                className="select select-bordered"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="all">All Projects</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="client">
                <span className="label-text">Client</span>
              </label>
              <select 
                id="client" 
                className="select select-bordered"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="all">All Clients</option>
              </select>
            </div>

            <div className="form-control self-end">
              <button type="button" className="btn btn-primary">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      
      {reportsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-200">
            <div className="stat-title">Total Time</div>
            <div className="stat-value text-primary">{reportsData.summary.formattedTotalTime}</div>
          </div>

          <div className="stat bg-base-200">
            <div className="stat-title">Billable Time</div>
            <div className="stat-value text-secondary">{reportsData.summary.billableTime}</div>
          </div>

          <div className="stat bg-base-200">
            <div className="stat-title">Total Earnings</div>
            <div className="stat-value text-accent">£{reportsData.summary.totalEarnings.toFixed(2)}</div>
          </div>

          <div className="stat bg-base-200">
            <div className="stat-title">Average Rate</div>
            <div className="stat-value">£{reportsData.summary.avgRate}/hr</div>
          </div>
        </div>
      )}

      {/* Detailed Report Table */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Time Breakdown</h2>
            <div className="join">
              <button 
                type="button" 
                className={`btn btn-sm join-item ${groupBy === 'project' ? 'btn-active' : ''}`}
                onClick={() => setGroupBy('project')}
              >
                By Project
              </button>
              <button 
                type="button" 
                className={`btn btn-sm join-item ${groupBy === 'client' ? 'btn-active' : ''}`}
                onClick={() => setGroupBy('client')}
              >
                By Client
              </button>
              <button 
                type="button" 
                className={`btn btn-sm join-item ${groupBy === 'day' ? 'btn-active' : ''}`}
                onClick={() => setGroupBy('day')}
              >
                By Day
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{groupBy === 'day' ? 'Date' : groupBy === 'client' ? 'Client' : 'Project'}</th>
                  <th>Time</th>
                  <th>Rate</th>
                  <th>Earnings</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {reportsData?.breakdown.map((item, index) => {
                  const colourClass = item.colour ? `bg-[${item.colour}]` : `bg-primary`;
                  const progressClass = index % 3 === 0 ? 'progress-primary' : 
                                       index % 3 === 1 ? 'progress-secondary' : 'progress-accent';
                  
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 ${colourClass} rounded-full`}></div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="font-mono">{item.formattedDuration}</td>
                      <td>£{item.avgRate}/hr</td>
                      <td className="font-medium">£{item.earnings.toFixed(2)}</td>
                      <td>
                        <progress
                          className={`progress ${progressClass} w-20`}
                          value={item.percentage}
                          max="100"
                        ></progress>
                      </td>
                    </tr>
                  );
                }) || (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      {loading ? "Loading..." : "No data available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card bg-base-200 mt-6">
        <div className="card-body">
          <h2 className="card-title">Time Distribution</h2>
          <div className="h-64 bg-base-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-base-content/50">
              <div className="text-4xl mb-2">📊</div>
              <p>Chart visualisation will go here</p>
              <p className="text-sm">(Integrate with Chart.js or similar)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}