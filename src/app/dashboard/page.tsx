"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/stores/app";
import { useTimerStore } from "@/lib/stores/timer";
import { TimeEntry, Project, Client } from "@/types";

interface PopulatedTimeEntry extends Omit<TimeEntry, 'clientId' | 'projectId'> {
  clientId?: Client;
  projectId?: Project;
}

interface PopulatedProject extends Omit<Project, 'clientId'> {
  clientId?: Client;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { viewMode, currentOrganisation } = useAppStore();
  const { isRunning, description, elapsedSeconds } = useTimerStore();

  const [stats, setStats] = useState({
    today: { duration: 0, entries: 0 },
    week: { duration: 0, entries: 0 },
    month: { duration: 0, entries: 0, earnings: 0 },
  });
  const [recentEntries, setRecentEntries] = useState<PopulatedTimeEntry[]>([]);
  const [activeProjects, setActiveProjects] = useState<PopulatedProject[]>([]);

  const calculateStats = useCallback((entries: TimeEntry[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEntries = entries.filter((e) => new Date(e.startTime) >= today);
    const weekEntries = entries.filter(
      (e) => new Date(e.startTime) >= weekStart,
    );
    const monthEntries = entries.filter(
      (e) => new Date(e.startTime) >= monthStart,
    );

    setStats({
      today: {
        duration: todayEntries.reduce((sum, e) => sum + e.duration, 0),
        entries: todayEntries.length,
      },
      week: {
        duration: weekEntries.reduce((sum, e) => sum + e.duration, 0),
        entries: weekEntries.length,
      },
      month: {
        duration: monthEntries.reduce((sum, e) => sum + e.duration, 0),
        entries: monthEntries.length,
        earnings: monthEntries.reduce(
          (sum, e) => sum + (e.appliedRate * e.duration) / 3600,
          0,
        ),
      },
    });
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (currentOrganisation)
        params.set("organisationId", currentOrganisation._id);

      const [entriesRes, projectsRes] = await Promise.all([
        fetch(`/api/time-entries?${params}&limit=5`),
        fetch(`/api/projects?${params}`),
      ]);

      if (entriesRes.ok) {
        const entriesData = await entriesRes.json();
        setRecentEntries(entriesData.timeEntries || []);
        calculateStats(entriesData.timeEntries || []);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setActiveProjects(projectsData.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [currentOrganisation, calculateStats]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session, fetchDashboardData]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your dashboard
          </h1>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/auth/signin";
            }}
            className="btn btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/70">
          Overview of your time tracking activity
          {viewMode === "organisation" && currentOrganisation && (
            <span> • {currentOrganisation.name}</span>
          )}
        </p>
      </div>

      {isRunning && (
        <div className="alert alert-info mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <title>Timer running info</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            Timer is running: <strong>{description}</strong> (
            {formatDuration(elapsedSeconds)})
          </span>
          <div>
            <Link href="/timer" className="btn btn-sm btn-outline">
              Go to Timer
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-200">
          <div className="stat-title">Today</div>
          <div className="stat-value text-primary">
            {formatDuration(stats.today.duration)}
          </div>
          <div className="stat-desc">{stats.today.entries} entries</div>
        </div>

        <div className="stat bg-base-200">
          <div className="stat-title">This Week</div>
          <div className="stat-value text-secondary">
            {formatDuration(stats.week.duration)}
          </div>
          <div className="stat-desc">{stats.week.entries} entries</div>
        </div>

        <div className="stat bg-base-200">
          <div className="stat-title">This Month</div>
          <div className="stat-value">
            {formatDuration(stats.month.duration)}
          </div>
          <div className="stat-desc">{stats.month.entries} entries</div>
        </div>

        <div className="stat bg-base-200">
          <div className="stat-title">Earnings</div>
          <div className="stat-value text-accent">
            {formatCurrency(stats.month.earnings)}
          </div>
          <div className="stat-desc">This month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="space-y-3">
              {recentEntries.length === 0 ? (
                <div className="text-center py-4 text-base-content/70">
                  <p>No recent activity</p>
                  <Link href="/timer" className="btn btn-sm btn-primary mt-2">
                    Start Timer
                  </Link>
                </div>
              ) : (
                recentEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex justify-between items-center p-3 bg-base-100 rounded"
                  >
                    <div>
                      <div className="font-medium">{entry.description}</div>
                      <div className="text-sm text-base-content/70">
                        {entry.clientId?.name} • {entry.projectId?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">
                        {formatDuration(entry.duration)}
                      </div>
                      <div className="text-sm text-base-content/70">
                        {new Date(entry.startTime).toLocaleDateString("en-GB", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentEntries.length > 0 && (
              <div className="card-actions justify-end mt-4">
                <Link href="/reports" className="btn btn-sm btn-outline">
                  View All
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Active Projects</h2>
            <div className="space-y-3">
              {activeProjects.length === 0 ? (
                <div className="text-center py-4 text-base-content/70">
                  <p>No projects yet</p>
                  <Link
                    href="/projects"
                    className="btn btn-sm btn-primary mt-2"
                  >
                    Create Project
                  </Link>
                </div>
              ) : (
                activeProjects.map((project, _index) => (
                  <div
                    key={project._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.colour }}
                      ></div>
                      <span>{project.name}</span>
                    </div>
                    <span className="text-sm text-base-content/70">
                      {project.clientId?.name}
                    </span>
                  </div>
                ))
              )}
            </div>
            {activeProjects.length > 0 && (
              <div className="card-actions justify-end mt-4">
                <Link href="/projects" className="btn btn-sm btn-outline">
                  Manage Projects
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex gap-4 justify-center">
          <Link href="/timer" className="btn btn-primary">
            <span className="mr-2">⏱️</span>
            Start Timer
          </Link>
          <Link href="/projects" className="btn btn-outline">
            <span className="mr-2">📁</span>
            Manage Projects
          </Link>
          <Link href="/reports" className="btn btn-outline">
            <span className="mr-2">📈</span>
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
