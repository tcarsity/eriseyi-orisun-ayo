import React, { useCallback, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import toast from "react-hot-toast";
import SideBar from "../admincontrol/SideBar";
import SearchBar from "../common/SearchBar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import TableRowSkeleton from "../ui/TableRowSkeleton";

const Show = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Admin deleted successfully");
      setDeletingId(null);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete admin";
      toast.error(message);
      setDeletingId(null);
    },
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const endpoint = search ? "/superadmin/search-admins" : "/users";
      const res = await api.get(endpoint, {
        params: { page, search },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const handlePageChange = useCallback(
    (newPage) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        params.set("page", newPage);
        if (search) params.set("search", search);
        return params;
      });
    },
    [search],
  );

  const users = data?.data ?? [];
  const meta = typeof data?.meta === "object" ? data.meta : null;

  const safeLastPage = meta?.last_page || 1;
  const safeCurrentPage = meta?.current_page || 1;

  const maxPagesToShow = 5;

  let startPage = Math.max(1, safeCurrentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > safeLastPage) {
    endPage = safeLastPage;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  useEffect(() => {
    if (!isLoading && data) {
      if (users.length === 0 && safeCurrentPage > 1) {
        handlePageChange(safeCurrentPage - 1);
      }
    }
  }, [data, isLoading, users.length, safeCurrentPage, handlePageChange]);

  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/account">Admins</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Admins
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Admins</h2>
                  <Link
                    to={`/superadmin-admin/create`}
                    className="btn btn-primary"
                  >
                    + Add Admin
                  </Link>
                </div>
                <SearchBar search={search} setSearchParams={setSearchParams} />
              </div>
              <div className="col-lg-3 sidebar">
                <SideBar />
              </div>

              <div className="col-lg-9 board">
                <div className="row ">
                  <div className="col-md-12">
                    {error ? (
                      <p>failed to load admins</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading || isFetching ? (
                              <TableRowSkeleton rows={5} columns={7} />
                            ) : users.length > 0 ? (
                              users.map((user, index) => (
                                <tr key={user.id}>
                                  <td>
                                    {(meta.current_page - 1) * meta.per_page +
                                      index +
                                      1}
                                  </td>
                                  <td>{user.name}</td>
                                  <td>{user.email}</td>
                                  <td>{user.role}</td>
                                  <td>
                                    <Link
                                      to={`/superadmin-admin/edit/${user.id}`}
                                      className="btn btn-light btn-icon"
                                    >
                                      <FaEdit className="me-2" />
                                      Edit
                                    </Link>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-icon"
                                      disabled={deletingId === user.id}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Are you sure you want to delete this admin?",
                                          )
                                        ) {
                                          setDeletingId(user.id);
                                          deleteMutation.mutate(user.id);
                                        }
                                      }}
                                    >
                                      <MdDelete className="me-2" />
                                      {deletingId === user.id
                                        ? "Deleting..."
                                        : "Delete"}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No admins yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <nav className="mt-4">
                  {safeLastPage > 1 && (
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${page === 1 ? "disabled" : ""} `}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page - 1)}
                        >
                          Previous
                        </button>
                      </li>

                      {startPage > 1 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}

                      {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => {
                          const pageNum = startPage + i;
                          return (
                            <li
                              key={pageNum}
                              className={`page-item ${
                                safeCurrentPage === pageNum ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        },
                      )}

                      {endPage < safeLastPage && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                      <li
                        className={`page-item ${
                          page === safeLastPage ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default React.memo(Show);
