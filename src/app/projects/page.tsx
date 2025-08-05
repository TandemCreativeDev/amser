"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/stores/app";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const { viewMode, currentOrganisation } = useAppStore();

  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [_view, _setView] = useState("projects");
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [_selectedClient, _setSelectedClient] = useState<any>(null);
  const [newClient, setNewClient] = useState({ name: "", colour: "#3B82F6" });
  const [newProject, setNewProject] = useState({
    name: "",
    clientId: "",
    category: "",
    colour: "#10B981",
    defaultRate: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (currentOrganisation)
        params.set("organisationId", currentOrganisation._id);

      const [clientsRes, projectsRes] = await Promise.all([
        fetch(`/api/clients?${params}`),
        fetch(`/api/projects?${params}`),
      ]);

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentOrganisation]);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session, fetchData]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newClient,
          organisationId: currentOrganisation?._id,
        }),
      });

      if (response.ok) {
        setNewClient({ name: "", colour: "#3B82F6" });
        setShowClientModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          organisationId: currentOrganisation?._id,
        }),
      });

      if (response.ok) {
        setNewProject({
          name: "",
          clientId: "",
          category: "",
          colour: "#10B981",
          defaultRate: 0,
        });
        setShowProjectModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to manage projects
          </h1>
          <button
            onClick={() => (window.location.href = "/api/auth/signin")}
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Projects & Clients</h1>
            <p className="text-base-content/70">
              Manage your projects, clients, and time tracking organisation
              {viewMode === "organisation" && currentOrganisation && (
                <span> • {currentOrganisation.name}</span>
              )}
            </p>
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-primary">
              Create New
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow">
              <li>
                <a onClick={() => setShowProjectModal(true)}>New Project</a>
              </li>
              <li>
                <a onClick={() => setShowClientModal(true)}>New Client</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className="btn btn-primary"
          onClick={() => setShowClientModal(true)}
        >
          <span className="mr-2">➕</span>
          Add Client
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setShowProjectModal(true)}
          disabled={clients.length === 0}
        >
          <span className="mr-2">📁</span>
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Clients ({clients.length})</h2>
            <div className="space-y-2">
              {clients.length === 0 ? (
                <div className="text-center py-8 text-base-content/70">
                  <p>No clients yet</p>
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => setShowClientModal(true)}
                  >
                    Add Your First Client
                  </button>
                </div>
              ) : (
                clients.map((client) => (
                  <div
                    key={client._id}
                    className="flex items-center justify-between p-3 bg-base-100 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: client.colour }}
                      ></div>
                      <span className="font-medium">{client.name}</span>
                    </div>
                    <div className="text-sm text-base-content/70">
                      {
                        projects.filter((p) => p.clientId._id === client._id)
                          .length
                      }{" "}
                      projects
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Projects ({projects.length})</h2>
            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-base-content/70">
                  <p>No projects yet</p>
                  {clients.length > 0 && (
                    <button
                      className="btn btn-sm btn-primary mt-2"
                      onClick={() => setShowProjectModal(true)}
                    >
                      Add Your First Project
                    </button>
                  )}
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-3 bg-base-100 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.colour }}
                      ></div>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-base-content/70">
                          {project.clientId?.name}
                          {project.category && ` • ${project.category}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">£{project.defaultRate}/hr</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Modal */}
      {showClientModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Client</h3>
            <form onSubmit={handleCreateClient} className="py-4">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Client Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Colour</span>
                </label>
                <input
                  type="color"
                  className="input input-bordered w-full h-12"
                  value={newClient.colour}
                  onChange={(e) =>
                    setNewClient({ ...newClient, colour: e.target.value })
                  }
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowClientModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Project</h3>
            <form onSubmit={handleCreateProject} className="py-4">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Project Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Client</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newProject.clientId}
                  onChange={(e) =>
                    setNewProject({ ...newProject, clientId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Category (Optional)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newProject.category}
                  onChange={(e) =>
                    setNewProject({ ...newProject, category: e.target.value })
                  }
                  placeholder="e.g. Development, Design, Marketing"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Default Hourly Rate (£)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input input-bordered w-full"
                  value={newProject.defaultRate}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      defaultRate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Colour</span>
                </label>
                <input
                  type="color"
                  className="input input-bordered w-full h-12"
                  value={newProject.colour}
                  onChange={(e) =>
                    setNewProject({ ...newProject, colour: e.target.value })
                  }
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
