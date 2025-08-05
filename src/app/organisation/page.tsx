"use client";

import { useState } from "react";

export default function OrganisationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Organisation</h1>
            <p className="text-base-content/70">
              Manage your team and shared resources
            </p>
          </div>

          <div className="dropdown dropdown-end">
            <button type="button" className="btn btn-primary">
              Switch Organisation
            </button>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <button type="button" className="font-medium">
                  Personal Workspace
                </button>
              </li>
              <li>
                <button type="button">
                  Acme Corp{" "}
                  <span className="badge badge-primary badge-sm">Current</span>
                </button>
              </li>
              <li>
                <button type="button">TechStart Ltd</button>
              </li>
              <li className="menu-title">
                <button className="btn btn-ghost btn-sm w-full">
                  + Create Organisation
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Organisation Context Banner */}
      <div className="alert alert-info mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
          aria-label="Information icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold">Currently viewing: Acme Corp</h3>
          <div className="text-xs">
            All projects, clients, and time entries are scoped to this
            organisation
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        <button
          type="button"
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          Team Members
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "projects" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Shared Projects
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200">
              <div className="stat-title">Team Members</div>
              <div className="stat-value text-primary">8</div>
              <div className="stat-desc">2 admins, 6 members</div>
            </div>

            <div className="stat bg-base-200">
              <div className="stat-title">Active Projects</div>
              <div className="stat-value text-secondary">12</div>
              <div className="stat-desc">3 clients</div>
            </div>

            <div className="stat bg-base-200">
              <div className="stat-title">This Month</div>
              <div className="stat-value text-accent">340h</div>
              <div className="stat-desc">Team total</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">JD</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        John Doe added 2h to Website Redesign
                      </div>
                      <div className="text-xs text-base-content/70">
                        2 minutes ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-xs">SM</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        Sarah Miller created new project: Mobile App v2
                      </div>
                      <div className="text-xs text-base-content/70">
                        1 hour ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Top Projects This Week</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Website Redesign</span>
                    <span className="font-mono text-sm">45h 30m</span>
                  </div>
                  <progress
                    className="progress progress-primary"
                    value="45"
                    max="60"
                  ></progress>

                  <div className="flex justify-between items-center">
                    <span>API Development</span>
                    <span className="font-mono text-sm">32h 15m</span>
                  </div>
                  <progress
                    className="progress progress-secondary"
                    value="32"
                    max="60"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Team Members</h2>
            <button type="button" className="btn btn-primary">
              Invite Member
            </button>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>This Week</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <span>JD</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">John Doe</div>
                            <div className="text-sm opacity-50">
                              john@acmecorp.com
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">Admin</span>
                      </td>
                      <td>Jan 2024</td>
                      <td className="font-mono">18h 30m</td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                          >
                            ⋮
                          </button>
                          <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                            <li>
                              <button type="button">Change Role</button>
                            </li>
                            <li>
                              <button type="button" className="text-error">
                                Remove
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10">
                              <span>SM</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Sarah Miller</div>
                            <div className="text-sm opacity-50">
                              sarah@acmecorp.com
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge">Member</span>
                      </td>
                      <td>Feb 2024</td>
                      <td className="font-mono">22h 15m</td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                          >
                            ⋮
                          </button>
                          <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                            <li>
                              <button type="button">Change Role</button>
                            </li>
                            <li>
                              <button type="button" className="text-error">
                                Remove
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Shared Projects</h2>
            <button type="button" className="btn btn-primary">
              Create Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <h3 className="card-title text-base">Website Redesign</h3>
                  </div>
                  <div className="dropdown dropdown-end">
                    <button type="button" className="btn btn-ghost btn-xs">
                      ⋮
                    </button>
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow">
                      <li>
                        <button type="button">Edit</button>
                      </li>
                      <li>
                        <button type="button">Archive</button>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-base-content/70">
                  Acme Corp • Development
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>This week</span>
                    <span className="font-mono">45h 30m</span>
                  </div>
                  <progress
                    className="progress progress-primary"
                    value="75"
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <h3 className="card-title text-base">API Development</h3>
                  </div>
                  <div className="dropdown dropdown-end">
                    <button type="button" className="btn btn-ghost btn-xs">
                      ⋮
                    </button>
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow">
                      <li>
                        <button type="button">Edit</button>
                      </li>
                      <li>
                        <button type="button">Archive</button>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-base-content/70">
                  TechStart • Backend
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>This week</span>
                    <span className="font-mono">32h 15m</span>
                  </div>
                  <progress
                    className="progress progress-secondary"
                    value="60"
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Organisation Settings</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Organisation Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  defaultValue="Acme Corp"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Default Rate</span>
                </label>
                <div className="input-group">
                  <span>£</span>
                  <input
                    type="number"
                    className="input input-bordered flex-1"
                    defaultValue="75"
                  />
                  <span>/hour</span>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Project Categories</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="badge badge-primary">Development</span>
                  <span className="badge badge-secondary">Design</span>
                  <span className="badge badge-accent">Marketing</span>
                  <span className="badge">Consulting</span>
                </div>
                <input
                  type="text"
                  placeholder="Add new category"
                  className="input input-bordered"
                />
              </div>

              <div className="card-actions justify-end">
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
