"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("week");
  const [selectedProject, setSelectedProject] = useState("all");

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
                <option value="1">Website Redesign</option>
                <option value="2">Mobile App</option>
                <option value="3">API Integration</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="client">
                <span className="label-text">Client</span>
              </label>
              <select id="client" className="select select-bordered">
                <option>All Clients</option>
                <option>Acme Corp</option>
                <option>TechStart</option>
                <option>DevCorp</option>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-200">
          <div className="stat-title">Total Time</div>
          <div className="stat-value text-primary">42h 35m</div>
        </div>

        <div className="stat bg-base-200">
          <div className="stat-title">Billable Time</div>
          <div className="stat-value text-secondary">38h 20m</div>
        </div>

        <div className="stat bg-base-200">
          <div className="stat-title">Total Earnings</div>
          <div className="stat-value text-accent">£3,215</div>
        </div>

        <div className="stat bg-base-200">
          <div className="stat-title">Average Rate</div>
          <div className="stat-value">£84/hr</div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Time Breakdown</h2>
            <div className="join">
              <button type="button" className="btn btn-sm join-item btn-active">
                By Project
              </button>
              <button type="button" className="btn btn-sm join-item">
                By Client
              </button>
              <button type="button" className="btn btn-sm join-item">
                By Day
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Time</th>
                  <th>Rate</th>
                  <th>Earnings</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="font-medium">Website Redesign</span>
                    </div>
                  </td>
                  <td>Acme Corp</td>
                  <td className="font-mono">22h 30m</td>
                  <td>£75/hr</td>
                  <td className="font-medium">£1,687.50</td>
                  <td>
                    <progress
                      className="progress progress-primary w-20"
                      value="75"
                      max="100"
                    ></progress>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="font-medium">Mobile App</span>
                    </div>
                  </td>
                  <td>TechStart</td>
                  <td className="font-mono">12h 15m</td>
                  <td>£90/hr</td>
                  <td className="font-medium">£1,102.50</td>
                  <td>
                    <progress
                      className="progress progress-secondary w-20"
                      value="45"
                      max="100"
                    ></progress>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="font-medium">API Integration</span>
                    </div>
                  </td>
                  <td>DevCorp</td>
                  <td className="font-mono">7h 50m</td>
                  <td>£65/hr</td>
                  <td className="font-medium">£510.00</td>
                  <td>
                    <progress
                      className="progress progress-accent w-20"
                      value="30"
                      max="100"
                    ></progress>
                  </td>
                </tr>
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
              <p>Chart visualization will go here</p>
              <p className="text-sm">(Integrate with Chart.js or similar)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
