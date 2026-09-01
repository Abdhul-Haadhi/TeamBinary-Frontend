import React, { useEffect, useMemo, useState } from "react";
import {
    Building2,
    Plus,
    Search,
    X,
    Check,
    Power,
    Users,
} from "lucide-react";

import "../css/OrganizationManagement.css";
import NavBar from "../components/NavBar";

const API_BASE = "http://localhost:8080/api";


const OrganizationManagement = () => {

    const [organizations, setOrganizations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({
        organizationCode: "",
        organizationName: "",
        address: "",
        adminEmail: "",
        adminPassword: "",
    });


    // ==========================================================
    // AUTH HEADER
    // ==========================================================

    const getHeaders = () => {

        const token =
            localStorage.getItem("token");

        return {
            "Content-Type": "application/json",

            Authorization:
                `Bearer ${token}`,
        };
    };


    // ==========================================================
    // LOAD ORGANIZATIONS
    // ==========================================================

    const loadOrganizations = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await fetch(
                    `${API_BASE}/organizations`,
                    {
                        method: "GET",
                        headers: getHeaders(),
                    }
                );


            if (!response.ok) {

                const text =
                    await response.text();

                throw new Error(
                    text || "Failed to load organizations"
                );
            }


            const data =
                await response.json();


            setOrganizations(
                data
            );

        } catch (err) {

            console.error(
                "Organization loading error:",
                err
            );

            setError(
                err.message ||
                "Unable to load organizations."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        loadOrganizations();

    }, []);


    // ==========================================================
    // FORM CHANGE
    // ==========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );


        setError("");

        setSuccess("");
    };


    // ==========================================================
    // CREATE ORGANIZATION
    // ==========================================================

    const handleCreateOrganization = async (
        event
    ) => {

        event.preventDefault();


        if (saving) {
            return;
        }


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const response =
                await fetch(
                    `${API_BASE}/organizations`,
                    {
                        method: "POST",

                        headers: getHeaders(),

                        body: JSON.stringify(
                            {
                                organizationCode:
                                    formData
                                        .organizationCode
                                        .trim(),

                                organizationName:
                                    formData
                                        .organizationName
                                        .trim(),

                                address:
                                    formData
                                        .address
                                        .trim(),

                                adminEmail:
                                    formData
                                        .adminEmail
                                        .trim(),

                                adminPassword:
                                    formData
                                        .adminPassword,
                            }
                        ),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Failed to create organization"
                );
            }


            setOrganizations(
                (previous) => [
                    ...previous,
                    data,
                ]
            );


            setFormData({
                organizationCode: "",
                organizationName: "",
                address: "",
                adminEmail: "",
                adminPassword: "",
            });


            setShowAddModal(false);


            setSuccess(
                "Organization created successfully."
            );
            setTimeout(
                () => setError(""),
                3000
            );


        } catch (err) {

            console.error(
                "Create organization error:",
                err
            );


            setError(
                err.message ||
                "Unable to create organization."
            );

        } finally {

            setSaving(false);
        }
    };


    // ==========================================================
    // CHANGE STATUS
    // ==========================================================

    const handleStatusChange = async (
        organization
    ) => {

        const newStatus =
            !organization.active;


        const actionText =
            newStatus
                ? "activate"
                : "deactivate";


        const confirmed =
            window.confirm(
                `Are you sure you want to ${actionText} ${organization.organizationName}?`
            );

        if (organization.organizationName == "AutoTrace System Administration") {
            setError("Unable to deactivate");

            setTimeout(
                () => setError(""),
                3000
            );

            return;
        }


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_BASE}/organizations/${organization.id}/status`,
                    {
                        method: "PATCH",

                        headers: getHeaders(),

                        body: JSON.stringify({
                            active:
                                newStatus,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Failed to update organization status"
                );
            }


            setOrganizations(
                (previous) =>
                    previous.map(
                        (item) =>
                            item.id === organization.id
                                ? data
                                : item
                    )
            );


            setSuccess(
                `Organization ${newStatus ? "activated" : "deactivated"} successfully.`
            );


            setTimeout(
                () => setSuccess(""),
                3000
            );


        } catch (err) {

            console.error(
                "Status update error:",
                err
            );


            setError(
                err.message ||
                "Unable to update organization."
            );
        }
    };


    // ==========================================================
    // CLOSE MODAL
    // ==========================================================

    const closeModal = () => {

        if (saving) {
            return;
        }


        setShowAddModal(false);


        setFormData({
            organizationCode: "",
            organizationName: "",
            address: "",
            adminEmail: "",
            adminPassword: "",
        });
    };


    // ==========================================================
    // FILTER
    // ==========================================================

    const filteredOrganizations =
        useMemo(() => {

            const query =
                search
                    .toLowerCase()
                    .trim();


            return organizations.filter(
                (organization) => {

                    const matchesSearch =
                        !query ||
                        organization.organizationCode
                            .toLowerCase()
                            .includes(query) ||
                        organization.organizationName
                            .toLowerCase()
                            .includes(query) ||
                        (organization.address || "")
                            .toLowerCase()
                            .includes(query);


                    const matchesStatus =
                        statusFilter === "ALL" ||
                        (
                            statusFilter === "ACTIVE" &&
                            organization.active
                        ) ||
                        (
                            statusFilter === "INACTIVE" &&
                            !organization.active
                        );


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            organizations,
            search,
            statusFilter,
        ]);


    const activeCount =
        organizations.filter(
            (organization) =>
                organization.active
        ).length;


    const inactiveCount =
        organizations.filter(
            (organization) =>
                !organization.active
        ).length;


    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <>

            <NavBar
                title="Organization Management"
            />

            <div className="organization-page">


                {/* ==================================================
                HEADER
            ================================================== */}

                <div className="organization-header">

                    <div className="organization-title">

                        <div className="organization-title-icon">
                            <Building2 size={25} />
                        </div>

                        <div>

                            <span className="organization-eyebrow">
                                System Administration
                            </span>

                            <h1>
                                Organization Management
                            </h1>

                            <p>
                                Manage independent law-enforcement
                                organizations using AutoTrace.
                            </p>

                        </div>

                    </div>


                    <button
                        className="add-organization-btn"
                        onClick={() =>
                            setShowAddModal(true)
                        }
                    >
                        <Plus size={17} />

                        Add Organization
                    </button>

                </div>


                {/* ==================================================
                ALERTS
            ================================================== */}

                {error && (

                    <div className="organization-alert error">

                        <span>
                            ⚠
                        </span>

                        {error}

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={15} />
                        </button>

                    </div>

                )}


                {success && (

                    <div className="organization-alert success">

                        <Check size={16} />

                        {success}

                    </div>

                )}


                {/* ==================================================
                SUMMARY
            ================================================== */}

                <div className="organization-summary">


                    <div className="organization-stat-card">

                        <div className="stat-icon blue">
                            <Building2 size={20} />
                        </div>

                        <div>

                            <span>
                                Total Organizations
                            </span>

                            <strong>
                                {organizations.length}
                            </strong>

                        </div>

                    </div>


                    <div className="organization-stat-card">

                        <div className="stat-icon green">
                            <Check size={20} />
                        </div>

                        <div>

                            <span>
                                Active
                            </span>

                            <strong>
                                {activeCount}
                            </strong>

                        </div>

                    </div>


                    <div className="organization-stat-card">

                        <div className="stat-icon red">
                            <Power size={20} />
                        </div>

                        <div>

                            <span>
                                Inactive
                            </span>

                            <strong>
                                {inactiveCount}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                CONTROLS
            ================================================== */}

                <div className="organization-controls">

                    <div className="organization-search">

                        <Search size={16} />

                        <input
                            type="text"
                            placeholder="Search organizations..."
                            value={search}
                            onChange={
                                (event) =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={
                            (event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                        }
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                    </select>

                </div>


                {/* ==================================================
                TABLE
            ================================================== */}

                <div className="organization-table-card">

                    {loading ? (

                        <div className="organization-loading">

                            <div className="organization-spinner"></div>

                            <p>
                                Loading organizations...
                            </p>

                        </div>

                    ) : filteredOrganizations.length === 0 ? (

                        <div className="organization-empty">

                            <Building2 size={42} />

                            <h3>
                                No organizations found
                            </h3>

                            <p>
                                Create an organization to begin.
                            </p>

                        </div>

                    ) : (

                        <div className="organization-table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Organization
                                        </th>

                                        <th>
                                            Code
                                        </th>

                                        <th>
                                            Address
                                        </th>

                                        <th>
                                            Users
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredOrganizations.map(
                                        (organization) => (

                                            <tr
                                                key={
                                                    organization.id
                                                }
                                            >

                                                <td>

                                                    <div className="organization-name-cell">

                                                        <div className="organization-row-icon">
                                                            <Building2
                                                                size={17}
                                                            />
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    organization.organizationName
                                                                }
                                                            </strong>

                                                            <span>
                                                                Organization
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="organization-code">
                                                        {
                                                            organization.organizationCode
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="organization-address">
                                                        {
                                                            organization.address ||
                                                            "Not specified"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="user-count">

                                                        <Users
                                                            size={15}
                                                        />

                                                        {
                                                            organization.totalUsers ||
                                                            0
                                                        }

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `organization-status ${organization.active
                                                                ? "active"
                                                                : "inactive"
                                                            }`
                                                        }
                                                    >

                                                        <span className="status-dot"></span>

                                                        {
                                                            organization.active
                                                                ? "Active"
                                                                : "Inactive"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        className={
                                                            `organization-action-btn ${organization.active
                                                                ? "deactivate"
                                                                : "activate"
                                                            }`
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                organization
                                                            )
                                                        }
                                                    >

                                                        <Power
                                                            size={14}
                                                        />

                                                        {
                                                            organization.active
                                                                ? "Deactivate"
                                                                : "Activate"
                                                        }

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* ==================================================
                ADD ORGANIZATION MODAL
            ================================================== */}

                {showAddModal && (

                    <div
                        className="organization-modal-overlay"
                        onClick={closeModal}
                    >

                        <div
                            className="organization-modal"
                            onClick={
                                (event) =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="organization-modal-header">

                                <div>

                                    <span>
                                        System Administration
                                    </span>

                                    <h2>
                                        Create Organization
                                    </h2>

                                    <p>
                                        Create the organization and its
                                        first administrator.
                                    </p>

                                </div>


                                <button
                                    onClick={closeModal}
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleCreateOrganization
                                }
                            >

                                <div className="organization-form-grid">


                                    <div className="organization-form-group">

                                        <label>
                                            Organization Code
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="organizationCode"
                                            placeholder="e.g. POLICE-KDY"
                                            value={
                                                formData.organizationCode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            disabled={saving}
                                        />

                                        <small>
                                            A unique code for this organization.
                                        </small>

                                    </div>


                                    <div className="organization-form-group">

                                        <label>
                                            Organization Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="organizationName"
                                            placeholder="e.g. Kandy Police Department"
                                            value={
                                                formData.organizationName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            disabled={saving}
                                        />

                                    </div>


                                    <div className="organization-form-group full">

                                        <label>
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="e.g. Kandy, Sri Lanka"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                        />

                                    </div>


                                    <div className="organization-form-section full">

                                        <div className="organization-section-title">

                                            <Users size={16} />

                                            <div>

                                                <strong>
                                                    Initial Administrator
                                                </strong>

                                                <span>
                                                    This account will manage
                                                    the new organization.
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="organization-form-group">

                                        <label>
                                            Administrator Email
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            name="adminEmail"
                                            placeholder="admin@example.com"
                                            value={
                                                formData.adminEmail
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            disabled={saving}
                                        />

                                    </div>


                                    <div className="organization-form-group">

                                        <label>
                                            Temporary Password
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="password"
                                            name="adminPassword"
                                            placeholder="Minimum 6 characters"
                                            value={
                                                formData.adminPassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            minLength={6}
                                            required
                                            disabled={saving}
                                        />

                                    </div>

                                </div>


                                <div className="organization-modal-actions">

                                    <button
                                        type="button"
                                        className="organization-cancel-btn"
                                        onClick={closeModal}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="organization-create-btn"
                                        disabled={saving}
                                    >

                                        {saving ? (
                                            <>
                                                <span className="small-spinner"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={16} />
                                                Create Organization
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
};

export default OrganizationManagement;