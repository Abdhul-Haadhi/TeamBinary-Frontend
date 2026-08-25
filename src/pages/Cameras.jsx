import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera, Plus, Trash2, Search, Wifi,
  X, Check, Eye, MapPin, Network, ChevronDown,
} from "lucide-react";


// ── Backend Base URL ───────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8080/api";

// ── Status Config ──────────────────────────────────────────────────────────────
const STATUS_CFG = {
  ACTIVE: { dot: "bg-green-400", badge: "text-green-400 border-green-500/40 bg-green-500/10", label: "Active", pulse: true },
  INACTIVE: { dot: "bg-yellow-400", badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10", label: "Inactive", pulse: false },
  OFFLINE: { dot: "bg-red-400", badge: "text-red-400 border-red-500/40 bg-red-500/10", label: "Offline", pulse: false },
};

const ALL_STATUSES = ["ACTIVE", "INACTIVE", "OFFLINE"];
const EMPTY_FORM = { ip: "", location: "", networkId: "", status: "ACTIVE" };
const isValidIP = (v) => /^(\d{1,3}\.){3}\d{1,3}$/.test(v);
const padId = (n) => String(n).padStart(3, "0");

// ── Backend response → frontend shape mappers ──────────────────────────────────
const mapCamera = (c) => ({
  id: c.cameraId,
  ip: c.ipAddress,
  location: c.location,
  status: c.status,
  networkId: c.networkId,
  networkName: c.networkName ?? "Unassigned",
});

const mapNetwork = (n) => ({
  id: n.networkId,
  name: n.networkName,
  status: n.status,
  totalCameras: n.totalCameras,
  activeCameras: n.activeCameras,
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Inline Status Dropdown
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function StatusDropdown({ currentStatus, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cfg = STATUS_CFG[currentStatus] ?? STATUS_CFG["OFFLINE"];

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    text-xs font-semibold border transition-all
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:brightness-125"}
                    ${cfg.badge}`}
        title={disabled ? "" : "Click to change status"}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
        {cfg.label}
        {!disabled && (
          <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-30 bg-gray-800
                        border border-gray-700 rounded-xl shadow-2xl overflow-hidden w-36">
          {ALL_STATUSES.map((s) => {
            const c = STATUS_CFG[s];
            const current = s === currentStatus;
            return (
              <button
                key={s}
                disabled={current}
                onClick={() => { onSelect(s); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs
                            font-semibold transition-colors text-left
                            ${current ? "bg-gray-700/60 cursor-not-allowed opacity-60" : "hover:bg-gray-700 cursor-pointer"}
                            ${c.badge.split(" ")[0]}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                {c.label}
                {current && <Check size={10} className="ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Reusable UI pieces ─────────────────────────────────────────────────────────
function StatCard({ label, value, colorClass, bgClass, borderClass }) {
  return (
    <div className={`${bgClass} border ${borderClass} rounded-xl p-4 flex flex-col gap-1`}>
      <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
      <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG["OFFLINE"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
      {cfg.label}
    </span>
  );
}

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center
                    justify-center z-50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function FormInput({ label, error, mono = false, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className={`w-full bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"}
          rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500
          focus:outline-none focus:border-blue-500 transition-colors ${mono ? "font-mono" : ""}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FormSelect({ label, error, children, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        {...props}
        className={`w-full bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"}
          rounded-lg px-3 py-2.5 text-sm text-white
          focus:outline-none focus:border-blue-500 transition-colors`}
      >
        {children}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════
export default function CameraManagement() {

  // ── Data state ─────────────────────────────────────────────────────────────
  const [cameras, setCameras] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [netFilter, setNetFilter] = useState("ALL");

  // ── Modal state ────────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [netOpen, setNetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [netStatusOpen, setNetStatusOpen] = useState(false);
  const [netDeleteOpen, setNetDeleteOpen] = useState(false);
  const [activeCam, setActiveCam] = useState(null);
  const [activeNet, setActiveNet] = useState(null);
  const [deleteNet, setDeleteNet] = useState(null);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErr, setFormErr] = useState({});
  const [netName, setNetName] = useState("");
  const [netErr, setNetErr] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const [toastError, setToastError] = useState(false);

  const showToast = (msg, isError = false) => {
    setToast(msg);
    setToastError(isError);
    setTimeout(() => setToast(null), 3000);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // API helpers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fetchCameras = useCallback(async () => {
    const res = await fetch(`${API_BASE}/cameras`);
    const data = await res.json();
    setCameras(data.map(mapCamera));
  }, []);

  const fetchNetworks = useCallback(async () => {
    const res = await fetch(`${API_BASE}/networks`);
    const data = await res.json();
    setNetworks(data.map(mapNetwork));
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchCameras(), fetchNetworks()]);
  }, [fetchCameras, fetchNetworks]);

  // ── Load on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshAll();
      } catch (err) {
        showToast("Failed to connect to server. Check your backend.", true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshAll]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Derived / filtered list
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const filtered = cameras.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.ip.includes(q) || c.location.toLowerCase().includes(q)) &&
      (statusFilter === "ALL" || c.status === statusFilter) &&
      (netFilter === "ALL" || String(c.networkId) === netFilter)
    );
  });

  const countByStatus = (s) => cameras.filter((c) => c.status === s).length;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Camera handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Validate form before sending to backend
  const validateForm = () => {
    const e = {};
    if (!form.ip) e.ip = "IP address is required";
    else if (!isValidIP(form.ip)) e.ip = "Invalid IP address format";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.networkId) e.networkId = "Please select a network";
    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  // POST /api/cameras
  const handleAddCamera = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/cameras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ipAddress: form.ip.trim(),
          location: form.location.trim(),
          networkId: parseInt(form.networkId),
          status: form.status,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        showToast(msg || "Failed to add camera", true);
        return;
      }

      await refreshAll();
      setForm(EMPTY_FORM);
      setFormErr({});
      setAddOpen(false);
      showToast("Camera added successfully");
    } catch (err) {
      showToast("Server error. Check your backend.", true);
    } finally {
      setSaving(false);
    }
  };

  // PATCH /api/cameras/{id}/status
  const handleCameraStatusChange = async (camId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/cameras/${camId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        showToast("Failed to update camera status", true);
        return;
      }

      await refreshAll();
      showToast(`CAM-${padId(camId)} updated to ${STATUS_CFG[newStatus].label}`);
    } catch (err) {
      showToast("Server error. Check your backend.", true);
    }
  };

  // DELETE /api/cameras/{id}
  const handleDeleteCamera = async () => {
    try {
      const res = await fetch(`${API_BASE}/cameras/${activeCam.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("Failed to delete camera", true);
        return;
      }

      await refreshAll();
      setDeleteOpen(false);
      setActiveCam(null);
      showToast("Camera removed");
    } catch (err) {
      showToast("Server error. Check your backend.", true);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Network handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // POST /api/networks
  const handleAddNetwork = async () => {
    if (!netName.trim()) { setNetErr("Network name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/networks/add-network`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ networkName: netName.trim(), status: "ACTIVE" }),
      });

      if (!res.ok) {
        const msg = await res.text();
        showToast(msg || "Failed to create network", true);
        return;
      }

      await fetchNetworks();
      setNetName("");
      setNetErr("");
      setNetOpen(false);
      showToast("Network created");
    } catch (err) {
      showToast("Server error. Check your backend.", true);
    } finally {
      setSaving(false);
    }
  };

  // PATCH /api/networks/{id}/status
  const handleNetworkStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/networks/${activeNet.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        showToast("Failed to update network status", true);
        return;
      }

      await fetchNetworks();
      setNetStatusOpen(false);
      setActiveNet(null);
      showToast(`Network updated to ${STATUS_CFG[newStatus].label}`);
    } catch (err) {
      showToast("Server error. Check your backend.", true);
    }
  };

  // DELETE /api/networks/{id}
  const handleDeleteNetwork = async () => {
    try {
      const res = await fetch(`${API_BASE}/networks/${deleteNet.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("Failed to delete network", true);
        return;
      }

      await refreshAll();
      setNetDeleteOpen(false);
      setDeleteNet(null);
      showToast("Network deleted");
    } catch (err) {
      showToast("Server error. Check your backend.", true);
    }
  };

  // ── Open / close helpers ───────────────────────────────────────────────────
  const openDetail = (cam) => { setActiveCam(cam); setDetailOpen(true); };
  const openDelete = (cam) => { setActiveCam(cam); setDeleteOpen(true); };
  const openNetStatus = (net) => { setActiveNet(net); setNetStatusOpen(true); };
  const openNetDelete = (net) => { setDeleteNet(net); setNetDeleteOpen(true); };

  const closeAdd = () => { setAddOpen(false); setForm(EMPTY_FORM); setFormErr({}); };
  const closeNet = () => { setNetOpen(false); setNetName(""); setNetErr(""); };
  const closeDetail = () => { setDetailOpen(false); setActiveCam(null); };
  const closeDelete = () => { setDeleteOpen(false); setActiveCam(null); };
  const closeNetSt = () => { setNetStatusOpen(false); setActiveNet(null); };
  const closeNetDelete = () => { setNetDeleteOpen(false); setDeleteNet(null); };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div
      className="min-h-screen bg-white-950 text-gray-100 p-6"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 text-white px-4 py-3
                         rounded-lg flex items-center gap-2 shadow-xl
                         ${toastError ? "bg-red-600" : "bg-green-600"}`}>
          <Check size={15} />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2.5 bg-blue-600 rounded-xl"><Camera size={22} /></div>
        <div>
          <h1 className="text-2xl font-bold">Camera Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Monitor and manage all CCTV cameras across the network
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Cameras" value={cameras.length} colorClass="text-blue-400" bgClass="bg-blue-500/10" borderClass="border-blue-500/30" />
        <StatCard label="Active" value={countByStatus("ACTIVE")} colorClass="text-green-400" bgClass="bg-green-500/10" borderClass="border-green-500/30" />
        <StatCard label="Inactive" value={countByStatus("INACTIVE")} colorClass="text-yellow-400" bgClass="bg-yellow-500/10" borderClass="border-yellow-500/30" />
        <StatCard label="Offline" value={countByStatus("OFFLINE")} colorClass="text-red-400" bgClass="bg-red-500/10" borderClass="border-red-500/30" />
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text" placeholder="Search by IP or location…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg
                       pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5
                     text-sm text-white focus:outline-none focus:border-blue-500">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="OFFLINE">Offline</option>
        </select>

        <select value={netFilter} onChange={(e) => setNetFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5
                     text-sm text-white focus:outline-none focus:border-blue-500">
          <option value="ALL">All Networks</option>
          {networks.map((n) => <option key={n.id} value={String(n.id)}>{n.name}</option>)}
        </select>

        <button onClick={() => setNetOpen(true)}
          className="bg-gray-700 hover:bg-gray-600 border border-gray-600
                     text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          + Network
        </button>

        <button onClick={() => setAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5
                     rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={15} /> Add Camera
        </button>
      </div>

      {/* ── Camera Table ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-7">
        <div className="overflow-x-auto">
          {loading ? <Spinner /> : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/60 border-b border-gray-700">
                  {["Camera ID", "IP Address", "Location", "Network"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-400
                                           uppercase tracking-wider text-left">{h}</th>
                  ))}
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400
                                 uppercase tracking-wider text-left">
                    Status
                    <span className="ml-1.5 text-gray-600 normal-case font-normal">(click to change)</span>
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400
                                 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-14 text-gray-500">
                      <Camera size={34} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No cameras found</p>
                    </td>
                  </tr>
                ) : filtered.map((cam, i) => (
                  <tr key={cam.id}
                    className={`border-b border-gray-800/40 hover:bg-gray-800/30 transition-colors
                                  ${i % 2 ? "bg-gray-800/10" : ""}`}>

                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-bold text-blue-400">
                        CAM-{padId(cam.id)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-gray-300">{cam.ip}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-200">{cam.location}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400">{cam.networkName}</span>
                    </td>

                    {/* Inline status dropdown */}
                    <td className="px-5 py-4">
                      <StatusDropdown
                        currentStatus={cam.status}
                        onSelect={(newStatus) => handleCameraStatusChange(cam.id, newStatus)}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openDetail(cam)} title="View Details"
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-gray-400
                                     hover:text-blue-400 transition-colors">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openDelete(cam)} title="Remove Camera"
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400
                                     hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-800 bg-gray-800/20">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {cameras.length} cameras
          </p>
        </div>
      </div>

      {/* ── Networks Grid ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider
                       mb-3 flex items-center gap-2">
          <Network size={14} className="text-blue-400" /> Camera Networks
        </h2>

        {loading ? <Spinner /> : (
          <div className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {networks.map((net) => (
              <div key={net.id}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500/50
                              rounded-xl p-4 transition-colors">

                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Wifi size={15} className="text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-600 font-mono">
                    NET-{String(net.id).padStart(2, "0")}
                  </span>
                </div>

                <p className="text-sm font-semibold text-white mb-2 leading-tight">{net.name}</p>

                <div className="flex gap-3 text-xs text-gray-500 mb-3">
                  <span>{net.totalCameras} camera{net.totalCameras !== 1 ? "s" : ""}</span>
                  <span className="text-green-400">{net.activeCameras} active</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <StatusBadge status={net.status} />
                  <div className="flex items-center gap-2">
                    <button onClick={() => openNetStatus(net)}
                      className="text-xs text-gray-500 hover:text-yellow-400
                                 transition-colors underline underline-offset-2">
                      Change
                    </button>
                    <button onClick={() => openNetDelete(net)} title="Delete Network"
                      className="p-1 rounded-lg hover:bg-red-500/20 text-gray-500
                                 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          MODAL — Add Camera
      ══════════════════════════════════════════════════════ */}
      {addOpen && (
        <Modal onClose={closeAdd}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[420px]">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Plus size={17} className="text-blue-400" />
                </div>
                <h3 className="text-base font-bold">Add New Camera</h3>
              </div>
              <button onClick={closeAdd} className="text-gray-400 hover:text-white p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <FormInput label="IP Address *" type="text" placeholder="e.g. 192.168.1.100"
                value={form.ip} onChange={(e) => setForm((f) => ({ ...f, ip: e.target.value }))}
                error={formErr.ip} mono />

              <FormInput label="Location *" type="text" placeholder="e.g. Main Road Junction"
                value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                error={formErr.location} />

              <FormSelect label="Camera Network *" value={form.networkId}
                onChange={(e) => setForm((f) => ({ ...f, networkId: e.target.value }))}
                error={formErr.networkId}>
                <option value="">Select a network…</option>
                {networks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
              </FormSelect>

              <div>
                <label className="block text-xs font-semibold text-gray-400
                                  uppercase tracking-wider mb-1.5">Initial Status</label>
                <div className="flex gap-2">
                  {ALL_STATUSES.map((s) => {
                    const cfg = STATUS_CFG[s];
                    const sel = form.status === s;
                    return (
                      <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all
                          ${sel ? cfg.badge : "text-gray-500 border-gray-700 hover:border-gray-600 bg-gray-800"}`}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-800">
              <button onClick={closeAdd}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                           rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleAddCamera} disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white
                           rounded-lg text-sm font-medium flex items-center
                           justify-center gap-2 transition-colors disabled:opacity-60">
                {saving ? "Saving…" : <><Plus size={15} /> Add Camera</>}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — Camera Detail
      ══════════════════════════════════════════════════════ */}
      {detailOpen && activeCam && (
        <Modal onClose={closeDetail}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[400px]">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg"><Camera size={17} className="text-gray-300" /></div>
                <h3 className="text-base font-bold">Camera Details</h3>
              </div>
              <button onClick={closeDetail} className="text-gray-400 hover:text-white p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {[
                { label: "Camera ID", value: `CAM-${padId(activeCam.id)}`, mono: true },
                { label: "IP Address", value: activeCam.ip, mono: true },
                { label: "Location", value: activeCam.location },
                { label: "Network", value: activeCam.networkName },
              ].map((row) => (
                <div key={row.label}
                  className="flex items-center justify-between py-3 border-b border-gray-800/60 last:border-0">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{row.label}</span>
                  <span className={`text-sm font-medium text-white ${row.mono ? "font-mono" : ""}`}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Status</span>
                <StatusBadge status={activeCam.status} />
              </div>
            </div>

            <div className="p-5 border-t border-gray-800">
              <button onClick={closeDetail}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                           rounded-lg text-sm font-medium transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — Delete Camera
      ══════════════════════════════════════════════════════ */}
      {deleteOpen && activeCam && (
        <Modal onClose={closeDelete}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl
                          w-[360px] text-center p-7">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full
                            flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Remove Camera</h3>
            <p className="text-sm text-gray-400">You are about to remove</p>
            <p className="text-sm font-semibold text-white mt-1">{activeCam.location}</p>
            <p className="font-mono text-xs text-gray-500 mt-1 mb-5">{activeCam.ip}</p>
            <p className="text-xs text-red-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={closeDelete}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                           rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleDeleteCamera}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white
                           rounded-lg text-sm font-medium transition-colors">Remove</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — Add Network
      ══════════════════════════════════════════════════════ */}
      {netOpen && (
        <Modal onClose={closeNet}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[380px]">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Network size={17} className="text-blue-400" />
                </div>
                <h3 className="text-base font-bold">Add Camera Network</h3>
              </div>
              <button onClick={closeNet} className="text-gray-400 hover:text-white p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <label className="block text-xs font-semibold text-gray-400
                                uppercase tracking-wider mb-1.5">Network Name *</label>
              <input type="text" placeholder="e.g. Network D – Southern Highway"
                value={netName}
                onChange={(e) => { setNetName(e.target.value); if (netErr) setNetErr(""); }}
                className={`w-full bg-gray-800 border ${netErr ? "border-red-500" : "border-gray-700"}
                  rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500
                  focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {netErr && <p className="text-red-400 text-xs mt-1">{netErr}</p>}
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-800">
              <button onClick={closeNet}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                           rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleAddNetwork} disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white
                           rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
                {saving ? "Creating…" : "Create Network"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — Delete Network
      ══════════════════════════════════════════════════════ */}
      {netDeleteOpen && deleteNet && (
        <Modal onClose={closeNetDelete}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl
                          w-[380px] text-center p-7">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full
                            flex items-center justify-center mx-auto mb-4">
              <Network size={22} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Delete Network</h3>
            <p className="text-sm text-gray-400">You are about to delete</p>
            <p className="text-sm font-semibold text-white mt-1">{deleteNet.name}</p>

            {deleteNet.totalCameras > 0 && (
              <div className="mt-3 mb-2 bg-yellow-500/10 border border-yellow-500/30
                              rounded-lg px-4 py-2.5 text-left">
                <p className="text-xs text-yellow-400 font-semibold mb-0.5">⚠ Warning</p>
                <p className="text-xs text-yellow-300">
                  {deleteNet.totalCameras} camera(s) will become unassigned.
                </p>
              </div>
            )}

            <p className="text-xs text-red-400 mt-3 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={closeNetDelete}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                           rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleDeleteNetwork}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white
                           rounded-lg text-sm font-medium transition-colors">Delete Network</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — Change Network Status
      ══════════════════════════════════════════════════════ */}
      {netStatusOpen && activeNet && (
        <Modal onClose={closeNetSt}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[380px]">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Network size={17} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Update Network Status</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{activeNet.name}</p>
                </div>
              </div>
              <button onClick={closeNetSt} className="text-gray-400 hover:text-white p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Current Status</span>
              <StatusBadge status={activeNet.status} />
            </div>

            <div className="px-5 pb-5 space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Select New Status</p>
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CFG[s];
                const current = activeNet.status === s;
                return (
                  <button key={s} disabled={current}
                    onClick={() => handleNetworkStatusChange(s)}
                    className={`w-full flex items-center justify-between px-4 py-3
                      rounded-xl border text-sm font-semibold transition-all
                      ${current
                        ? `${cfg.badge} opacity-60 cursor-not-allowed`
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700 cursor-pointer"
                      }`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
                      {cfg.label}
                    </div>
                    {current && <Check size={12} className="text-gray-400" />}
                  </button>
                );
              })}
            </div>

            <div className="px-5 pb-5">
              <button onClick={closeNetSt}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300
                           rounded-lg text-sm font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}