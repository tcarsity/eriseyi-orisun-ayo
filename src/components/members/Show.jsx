import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import Layout from "../common/Layout";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
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

  const { user } = useAuth();
  if (!user) return null;
  const rolePrefix = user?.role === "superadmin" ? "superadmin" : "admin";

  const deleteMutation = useMutation({
    mutationFn: async (memberId) => {
      await api.delete(`/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
      toast.success("Member deleted successfully");
      setDeletingId(null);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete member";
      toast.error(message);
      setDeletingId(null);
    },
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["members", page, search],
    queryFn: async () => {
      const endpoint = search ? "/members/search" : "/members";
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

  const members = data?.data ?? [];
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
      if (members.length === 0 && safeCurrentPage > 1) {
        handlePageChange(safeCurrentPage - 1);
      }
    }
  }, [data, isLoading, members.length, safeCurrentPage, handlePageChange]);

  return (
    <>
      <Layout>
        <section className="dashboard">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/account"> Members</Link>
                </li>
                <li
                  className="breadcrumb-item active bread"
                  aria-current="page"
                >
                  Members
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Members</h2>
                  <Link
                    to={`/${rolePrefix}-member/create`}
                    className="btn btn-primary"
                  >
                    + Add Member
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
                      <p>failed to load members</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover table-sm align-middle">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Address</th>
                              <th>Gender</th>
                              <th>Birth Month</th>
                              <th>Birth Date</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading || isFetching ? (
                              <TableRowSkeleton rows={10} columns={9} />
                            ) : members.length > 0 ? (
                              members.map((member, index) => (
                                <tr key={member.id}>
                                  <td>
                                    {(meta.current_page - 1) * meta.per_page +
                                      index +
                                      1}
                                  </td>

                                  <td>{member.name}</td>
                                  <td>{member.phone}</td>
                                  <td>{member.address}</td>
                                  <td>{member.gender}</td>
                                  <td>{member.birth_month}</td>
                                  <td>{member.birth_date}</td>

                                  <td>
                                    <Link
                                      to={`/${rolePrefix}-member/edit/${member.id}`}
                                      className="btn btn-light btn-icon btn-sm"
                                    >
                                      <FaEdit />
                                      Edit
                                    </Link>
                                  </td>

                                  <td>
                                    <button
                                      className="btn btn-danger btn-icon btn-sm"
                                      disabled={deletingId === member.id}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Are you sure you want to delete this member?",
                                          )
                                        ) {
                                          setDeletingId(member.id);

                                          deleteMutation.mutate(member.id);
                                        }
                                      }}
                                    >
                                      <MdDelete />

                                      {deletingId === member.id
                                        ? "Deleting..."
                                        : "Delete"}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  No members yet
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
