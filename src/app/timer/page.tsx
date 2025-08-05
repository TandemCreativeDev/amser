"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/stores/app";
import { useTimerStore } from "@/lib/stores/timer";
import type { ProjectWithClient, TimeEntryWithDetails } from "@/types";

export default function TimerPage() {
  const { data: session } = useSession();
  const { currentOrganisation } = useAppStore();
  const {
    isRunning,
    description,
    projectId,
    clientId,
    elapsedSeconds,
    start,
    stop,
    reset,
    updateDescription,
    updateProject,
    tick,
  } = useTimerStore();

  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithDetails[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");

  const fetchProjects = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (currentOrganisation)
        params.set("organisationId", currentOrganisation._id);

      const response = await fetch(`/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, [currentOrganisation]);

  const fetchTimeEntries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (currentOrganisation)
        params.set("organisationId", currentOrganisation._id);
      params.set("limit", "10");

      const response = await fetch(`/api/time-entries?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data.timeEntries || []);
      }
    } catch (error) {
      console.error("Error fetching time entries:", error);
    }
  }, [currentOrganisation]);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    if (session?.user) {
      fetchProjects();
      fetchTimeEntries();
    }
  }, [session, fetchProjects, fetchTimeEntries]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    const start = new Date(startTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const end = new Date(endTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${start} - ${end}`;
  };

  const handleStartStop = async () => {
    if (isRunning) {
      if (description && projectId && clientId) {
        try {
          await fetch("/api/time-entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              description,
              startTime: new Date(Date.now() - elapsedSeconds * 1000),
              duration: elapsedSeconds,
              projectId,
              clientId,
              organisationId: currentOrganisation?._id,
            }),
          });
          fetchTimeEntries();
        } catch (error) {
          console.error("Error saving time entry:", error);
        }
      }
      stop();
    } else {
      if (!description) {
        return;
      }
      const selectedProject = projects.find((p) => p._id === selectedProjectId);
      if (selectedProject) {
        start(description, selectedProject._id, selectedProject.clientId._id);
      } else {
        start(description);
      }
    }
  };

  const handleReset = () => {
    reset();
    setSelectedProjectId("");
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    const selectedProject = projects.find((p) => p._id === projectId);
    if (selectedProject) {
      updateProject(selectedProject._id, selectedProject.clientId._id);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to use the timer
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
        <h1 className="text-3xl font-bold">Timer</h1>
        <p className="text-base-content/70">
          Track your time with the live timer
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl font-mono font-bold mb-6 text-primary">
              {formatTime(elapsedSeconds)}
            </div>

            <div className="form-control w-full mb-6">
              <input
                type="text"
                placeholder="What are you working on?"
                className="input input-bordered w-full text-lg"
                value={description}
                onChange={(e) => updateDescription(e.target.value)}
              />
            </div>

            <div className="form-control w-full mb-6">
              <select
                className="select select-bordered w-full"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option disabled value="">
                  Select project
                </option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name} - {project.clientId?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="card-actions justify-center gap-4">
              <button
                type="button"
                className={`btn btn-lg ${isRunning ? "btn-error" : "btn-primary"}`}
                onClick={handleStartStop}
                disabled={!description || (!isRunning && !selectedProjectId)}
              >
                {isRunning ? "Stop" : "Start"}
              </button>

              <button
                type="button"
                className="btn btn-lg btn-outline"
                onClick={handleReset}
                disabled={elapsedSeconds === 0 && !isRunning}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Entries</h2>
          <div className="space-y-2">
            {timeEntries.length === 0 ? (
              <div className="text-center py-8 text-base-content/70">
                <p>No time entries yet. Start tracking your time!</p>
              </div>
            ) : (
              timeEntries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex justify-between items-center p-4 bg-base-200 rounded-lg"
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
                    {entry.endTime && (
                      <div className="text-sm text-base-content/70">
                        {formatTimeRange(entry.startTime, entry.endTime)}
                      </div>
                    )}
                  </div>
                  <div className="dropdown dropdown-end">
                    <button
                      type="button"
                      tabIndex={0}
                      className="btn btn-ghost btn-sm"
                    >
                      ⋮
                    </button>
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                      <li>
                        <button type="button">Edit</button>
                      </li>
                      <li>
                        <button type="button">Duplicate</button>
                      </li>
                      <li>
                        <button type="button" className="text-error">
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
