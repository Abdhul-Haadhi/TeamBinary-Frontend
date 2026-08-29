import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Eye
} from "lucide-react";

import "../css/Investigators.css";


const API_BASE ="http://localhost:8080/api";


const Investigators = () => {

  const [investigators, setInvestigators] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingInvestigator, setEditingInvestigator] =
    useState(null);

  const [selectedInvestigator, setSelectedInvestigator] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  // =========================================================
  // HEADERS
  // =========================================================

  const getHeaders = () => {

    const token =
      localStorage.getItem("token");


    return {
      "Content-Type":
        "application/json",

      Authorization:
        `Bearer ${token}`,
    };
  };


  // =========================================================
  // LOAD
  // =========================================================

  const loadInvestigators = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          `${API_BASE}/investigators`,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to load investigators"
        );
      }


      const data =
        text
          ? JSON.parse(text)
          : [];


      setInvestigators(
        data
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load investigators."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadInvestigators();

  }, []);


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredInvestigators =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return investigators;
      }


      return investigators.filter(
        (investigator) =>
          investigator.email
            .toLowerCase()
            .includes(query)
      );

    }, [
      investigators,
      search
    ]);


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );


    setError("");
  };


  // =========================================================
  // OPEN CREATE
  // =========================================================

  const openCreateModal = () => {

    setEditingInvestigator(null);

    setForm({
      email: "",
      password: "",
    });

    setError("");

    setShowModal(true);
  };


  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditModal = (
    investigator
  ) => {

    setEditingInvestigator(
      investigator
    );


    setForm({
      email:
        investigator.email,

      password:
        "",
    });


    setError("");

    setShowModal(true);
  };


  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (saving) {
      return;
    }


    try {

      setSaving(true);

      setError("");


      const isEditing =
        Boolean(
          editingInvestigator
        );


      const url =
        isEditing

          ? `${API_BASE}/investigators/${editingInvestigator.userId}`

          : `${API_BASE}/investigators`;


      const response =
        await fetch(
          url,
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers:
              getHeaders(),

            body:
              JSON.stringify(
                {
                  email:
                    form.email.trim(),

                  ...(form.password
                    ? {
                      password:
                        form.password
                    }
                    : {})
                }
              )
          }
        );


      const text =
        await response.text();


      let data = null;


      try {

        data =
          text
            ? JSON.parse(text)
            : null;

      } catch {
        data = text;
      }


      if (!response.ok) {

        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
            "Operation failed"
        );
      }


      if (isEditing) {

        setInvestigators(
          previous =>
            previous.map(
              item =>
                item.userId ===
                  editingInvestigator.userId
                  ? data
                  : item
            )
        );


        setSuccess(
          "Investigator updated successfully."
        );

      } else {

        setInvestigators(
          previous => [
            ...previous,
            data
          ]
        );


        setSuccess(
          "Investigator created successfully."
        );
      }


      setShowModal(false);


      setEditingInvestigator(
        null
      );


      setForm({
        email: "",
        password: "",
      });


      setTimeout(
        () =>
          setSuccess(""),
        3000
      );


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to save investigator."
      );

    } finally {

      setSaving(false);
    }
  };


  // =========================================================
  // DELETE
  // =========================================================

  const openDeleteModal = (
    investigator
  ) => {

    setSelectedInvestigator(
      investigator
    );

    setShowDeleteModal(
      true
    );
  };


  const handleDelete = async () => {

    if (!selectedInvestigator) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_BASE}/investigators/${selectedInvestigator.userId}`,
          {
            method:
              "DELETE",

            headers:
              getHeaders()
          }
        );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to delete investigator"
        );
      }


      setInvestigators(
        previous =>
          previous.filter(
            investigator =>
              investigator.userId !==
              selectedInvestigator.userId
          )
      );


      setShowDeleteModal(
        false
      );


      setSelectedInvestigator(
        null
      );


      setSuccess(
        "Investigator deleted successfully."
      );


      setTimeout(
        () =>
          setSuccess(""),
        3000
      );


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to delete investigator."
      );
    }
  };


  // =========================================================
  // VIEW
  // =========================================================

  const openViewModal = (
    investigator
  ) => {

    setSelectedInvestigator(
      investigator
    );

    setShowViewModal(
      true
    );
  };


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {

    if (saving) {
      return;
    }


    setShowModal(
      false
    );

    setEditingInvestigator(
      null
    );

    setForm({
      email: "",
      password: "",
    });
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="investigator-page">


      {/* =================================================
                HEADER
            ================================================= */}

      <div className="investigator-header">

        <div className="investigator-title">

          <div className="investigator-title-icon">

            <Users size={24} />

          </div>


          <div>

            <span className="investigator-eyebrow">
              Organization Administration
            </span>

            <h1>
              Investigator Management
            </h1>

            <p>
              Manage investigators within your
              organization.
            </p>

          </div>

        </div>


        <button
          className="add-investigator-btn"
          onClick={
            openCreateModal
          }
        >

          <UserPlus size={17} />

          Add Investigator

        </button>

      </div>


      {/* =================================================
                ALERTS
            ================================================= */}

      {error && (

        <div className="investigator-alert error">

          <span>⚠</span>

          <span>
            {error}
          </span>


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

        <div className="investigator-alert success">

          <Check size={16} />

          <span>
            {success}
          </span>

        </div>

      )}


      {/* =================================================
                SUMMARY
            ================================================= */}

      <div className="investigator-summary">

        <div className="investigator-stat-card">

          <div className="investigator-stat-icon">
            <Users size={20} />
          </div>

          <div>

            <span>
              Total Investigators
            </span>

            <strong>
              {investigators.length}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
                SEARCH
            ================================================= */}

      <div className="investigator-controls">

        <div className="investigator-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search investigator by email..."
            value={search}
            onChange={
              event =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>

      </div>


      {/* =================================================
                TABLE
            ================================================= */}

      <div className="investigator-table-card">

        {loading ? (

          <div className="investigator-loading">

            <div className="investigator-spinner"></div>

            <p>
              Loading investigators...
            </p>

          </div>

        ) : filteredInvestigators.length === 0 ? (

          <div className="investigator-empty">

            <Users size={42} />

            <h3>
              No investigators found
            </h3>

            <p>
              Add an investigator to your
              organization to begin.
            </p>

          </div>

        ) : (

          <div className="investigator-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Investigator
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Organization
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredInvestigators.map(
                  investigator => (

                    <tr
                      key={
                        investigator.userId
                      }
                    >

                      <td>

                        <div className="investigator-name-cell">

                          <div className="investigator-avatar">

                            <Users
                              size={17}
                            />

                          </div>


                          <div>

                            <strong>
                              {
                                investigator.email
                              }
                            </strong>

                            <span>
                              ID: {investigator.userId}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="investigator-role">
                          INVESTIGATOR
                        </span>

                      </td>


                      <td>

                        <div className="investigator-org">

                          <strong>
                            {
                              investigator.organizationName
                            }
                          </strong>

                          <span>
                            {
                              investigator.organizationCode
                            }
                          </span>

                        </div>

                      </td>


                      <td>

                        <div className="investigator-actions">

                          <button
                            className="view-investigator-btn"
                            title="View"
                            onClick={() =>
                              openViewModal(
                                investigator
                              )
                            }
                          >

                            <Eye
                              size={15}
                            />

                          </button>


                          <button
                            className="edit-investigator-btn"
                            title="Edit"
                            onClick={() =>
                              openEditModal(
                                investigator
                              )
                            }
                          >

                            <Pencil
                              size={15}
                            />

                          </button>


                          <button
                            className="delete-investigator-btn"
                            title="Delete"
                            onClick={() =>
                              openDeleteModal(
                                investigator
                              )
                            }
                          >

                            <Trash2
                              size={15}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

      {showModal && (

        <div
          className="investigator-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="investigator-modal"
            onClick={
              event =>
                event.stopPropagation()
            }
          >

            <div className="investigator-modal-header">

              <div>

                <span>
                  Organization Administration
                </span>

                <h2>
                  {
                    editingInvestigator
                      ? "Edit Investigator"
                      : "Add Investigator"
                  }
                </h2>

                <p>
                  {
                    editingInvestigator
                      ? "Update the investigator account."
                      : "Create an investigator account for your organization."
                  }
                </p>

              </div>


              <button
                onClick={
                  closeModal
                }
              >
                <X size={18} />
              </button>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="investigator-form">

                <div className="investigator-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="investigator@example.com"
                    required
                    disabled={
                      saving
                    }
                  />

                </div>


                <div className="investigator-form-group">

                  <label>
                    {
                      editingInvestigator
                        ? "New Password (optional)"
                        : "Password"
                    }
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      editingInvestigator
                        ? "Leave blank to keep current password"
                        : "Minimum 6 characters"
                    }
                    required={
                      !editingInvestigator
                    }
                    minLength={
                      6
                    }
                    disabled={
                      saving
                    }
                  />

                </div>


                <div className="investigator-info-box">

                  <div>
                    <strong>
                      Role
                    </strong>

                    <span>
                      INVESTIGATOR
                    </span>
                  </div>


                  <div>
                    <strong>
                      Organization
                    </strong>

                    <span>
                      Current organization
                    </span>
                  </div>

                </div>

              </div>


              <div className="investigator-modal-actions">

                <button
                  type="button"
                  className="investigator-cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="investigator-save-btn"
                  disabled={
                    saving
                  }
                >

                  {saving ? "Saving..." : editingInvestigator ? "Save Changes" : "Create Investigator" }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
                VIEW MODAL
            ================================================= */}

      {showViewModal &&
        selectedInvestigator && (

          <div
            className="investigator-modal-overlay"
            onClick={() =>
              setShowViewModal(
                false
              )
            }
          >

            <div
              className="investigator-small-modal"
              onClick={
                event =>
                  event.stopPropagation()
              }
            >

              <div className="investigator-modal-header">

                <div>

                  <span>
                    Investigator Details
                  </span>

                  <h2>
                    Account Information
                  </h2>

                </div>


                <button
                  onClick={() =>
                    setShowViewModal(
                      false
                    )
                  }
                >
                  <X size={18} />
                </button>

              </div>


              <div className="investigator-details">

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {
                      selectedInvestigator.email
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    User ID
                  </span>

                  <strong>
                    {
                      selectedInvestigator.userId
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Role
                  </span>

                  <strong>
                    INVESTIGATOR
                  </strong>

                </div>


                <div>

                  <span>
                    Organization
                  </span>

                  <strong>
                    {
                      selectedInvestigator.organizationName
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Organization Code
                  </span>

                  <strong>
                    {
                      selectedInvestigator.organizationCode
                    }
                  </strong>

                </div>

              </div>


              <div className="investigator-modal-actions">

                <button
                  className="investigator-cancel-btn"
                  onClick={() =>
                    setShowViewModal(
                      false
                    )
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


      {/* =================================================
                DELETE MODAL
            ================================================= */}

      {showDeleteModal &&
        selectedInvestigator && (

          <div
            className="investigator-modal-overlay"
            onClick={() =>
              setShowDeleteModal(
                false
              )
            }
          >

            <div
              className="investigator-small-modal delete"
              onClick={
                event =>
                  event.stopPropagation()
              }
            >

              <div className="delete-icon">

                <Trash2 size={24} />

              </div>


              <h2>
                Delete Investigator
              </h2>


              <p>
                Are you sure you want to
                delete this investigator?
              </p>


              <strong>
                {
                  selectedInvestigator.email
                }
              </strong>


              <div className="investigator-modal-actions">

                <button
                  className="investigator-cancel-btn"
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  className="investigator-delete-confirm-btn"
                  onClick={
                    handleDelete
                  }
                >
                  Delete Investigator
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};


export default Investigators;