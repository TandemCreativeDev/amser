"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-base-content/70">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        <button
          className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === "preferences" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("preferences")}
        >
          Preferences
        </button>
        <button
          className={`tab ${activeTab === "rates" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("rates")}
        >
          Rate Rules
        </button>
        <button
          className={`tab ${activeTab === "integrations" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("integrations")}
        >
          Integrations
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Profile Information</h2>

              <div className="flex items-center gap-6 mb-6">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <span className="text-2xl">JD</span>
                  </div>
                </div>
                <div>
                  <button className="btn btn-outline btn-sm">
                    Change Avatar
                  </button>
                  <p className="text-sm text-base-content/70 mt-1">
                    JPG, PNG or GIF (max 2MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    defaultValue="John Doe"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered"
                    defaultValue="john@example.com"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Timezone</span>
                  </label>
                  <select className="select select-bordered">
                    <option>UTC</option>
                    <option selected>Europe/London</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                  </select>
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
              </div>

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Display Preferences</h2>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Theme</span>
                  <select className="select select-bordered w-auto">
                    <option>Light</option>
                    <option selected>Dark</option>
                    <option>System</option>
                  </select>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Time Format</span>
                  <select className="select select-bordered w-auto">
                    <option selected>24-hour (14:30)</option>
                    <option>12-hour (2:30 PM)</option>
                  </select>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Week starts on</span>
                  <select className="select select-bordered w-auto">
                    <option selected>Monday</option>
                    <option>Sunday</option>
                  </select>
                </label>
              </div>

              <div className="divider"></div>

              <h3 className="font-bold">Notifications</h3>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Daily summary emails</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Weekly reports</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Timer reminders</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary">Save Preferences</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Rules Tab */}
      {activeTab === "rates" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Rate Rules</h2>
              <p className="text-base-content/70">
                Set up conditional billing rules based on weekly hours
              </p>
            </div>
            <button className="btn btn-primary">Create Rule</button>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Development Premium Rate</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                  />
                  <span className="text-sm">Active</span>
                </div>
              </div>

              <div className="text-sm text-base-content/70 mb-4">
                When weekly hours in &quot;Development&quot; category ≥ 22.5
                hours, apply £150/hour for remaining time
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Category</div>
                  <div>Development</div>
                </div>
                <div>
                  <div className="font-medium">Threshold</div>
                  <div>22.5 hours/week</div>
                </div>
                <div>
                  <div className="font-medium">Base Rate</div>
                  <div>£75/hour</div>
                </div>
                <div>
                  <div className="font-medium">Premium Rate</div>
                  <div>£150/hour</div>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Edit</button>
                <button className="btn btn-error btn-outline btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Design Overtime Rate</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="toggle" />
                  <span className="text-sm">Inactive</span>
                </div>
              </div>

              <div className="text-sm text-base-content/70 mb-4">
                When weekly hours in &quot;Design&quot; category ≥ 20 hours,
                apply £120/hour for remaining time
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Category</div>
                  <div>Design</div>
                </div>
                <div>
                  <div className="font-medium">Threshold</div>
                  <div>20 hours/week</div>
                </div>
                <div>
                  <div className="font-medium">Base Rate</div>
                  <div>£80/hour</div>
                </div>
                <div>
                  <div className="font-medium">Premium Rate</div>
                  <div>£120/hour</div>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Edit</button>
                <button className="btn btn-error btn-outline btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Available Integrations</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-100">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title text-base">GitHub</h3>
                        <p className="text-sm text-base-content/70">
                          Sync commits and issues
                        </p>
                      </div>
                      <button className="btn btn-outline btn-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title text-base">Slack</h3>
                        <p className="text-sm text-base-content/70">
                          Time tracking notifications
                        </p>
                      </div>
                      <button className="btn btn-primary btn-sm">
                        Connected
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title text-base">Trello</h3>
                        <p className="text-sm text-base-content/70">
                          Track time on cards
                        </p>
                      </div>
                      <button className="btn btn-outline btn-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title text-base">
                          Google Calendar
                        </h3>
                        <p className="text-sm text-base-content/70">
                          Sync meetings and events
                        </p>
                      </div>
                      <button className="btn btn-outline btn-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">API Access</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">API Key</span>
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className="input input-bordered flex-1"
                    defaultValue="sk_live_1234567890abcdef"
                  />
                  <button className="btn btn-outline">Regenerate</button>
                </div>
                <label className="label">
                  <span className="label-text-alt">
                    Use this key to access the ClepSync API
                  </span>
                </label>
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-outline">View Documentation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
