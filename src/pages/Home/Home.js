import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Tables from "../../components/Tables/Tables";
import Spiner from "../../components/Spinner/Spiner";
import Alert from "react-bootstrap/Alert";
import { useContext } from "react";
import {
  addData,
  updateData,
  dltdata,
} from "../../components/context/ContextProvider";
import { usergetfunc, deletefunc } from "../../services/Apis";
import "./Home.css";
import { toast } from "react-toastify";

const Home = () => {
  const [userdata, setUserData] = useState([]);
  const [showspin, setShowSpin] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const { useradd, setUseradd } = useContext(addData);
  const { update, setUpdate } = useContext(updateData);
  const { deletedata, setDLtdata } = useContext(dltdata);

  const navigate = useNavigate();

  const adduser = () => {
    navigate("/register");
  };

  const userGet = async () => {
    const response = await usergetfunc(search, gender, status, sort, page);
    if (response.status === 200) {
      setUserData(response.data.usersdata);
      setPageCount(response.data.Pagination.pageCount);
    } else {
      console.log("Error in getting user data");
    }
  };

  const deleteUser = async (id) => {
    const response = await deletefunc(id);
    if (response.status === 200) {
      userGet();
      setDLtdata(response.data);
    } else {
      toast.error("Error");
    }
  };

  const handlePrevious = () => {
    setPage(() => {
      if (page === 1) return page;
      return page - 1;
    });
  };

  const handleNext = () => {
    setPage(() => {
      if (page === pageCount) return page;
      return page + 1;
    });
  };

  useEffect(() => {
    userGet();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [search, gender, status, sort, page]);
  return (
    <>
      {useradd ? (
        <Alert variant="success" onClose={() => setUseradd("")} dismissible>
          {useradd.fname.toUpperCase()} Succesfully Added
        </Alert>
      ) : (
        ""
      )}

      {update ? (
        <Alert variant="warning" onClose={() => setUpdate("")} dismissible>
          {update.fname.toUpperCase()} Succesfully Updated
        </Alert>
      ) : (
        ""
      )}

      {deletedata ? (
        <Alert variant="danger" onClose={() => setDLtdata("")} dismissible>
          {deletedata.fname.toUpperCase()} Succesfully Deleted
        </Alert>
      ) : (
        ""
      )}
      <div className="container-fluid">
        <div className="main_div">
          <div className="search_add mt-4 d-flex justify-content-between ">
            <div className="search col-lg-4 ">
              <Form className="d-flex mt-2">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="warning" className="search_btn">
                  Search
                </Button>
              </Form>
            </div>
            <div className="add_btn mt-1">
              <Button variant="primary" onClick={adduser}>
                <i class="fa-solid fa-plus"></i>&nbsp; Add User
              </Button>
            </div>
          </div>
          <div className="filter_div mt-5 d-flex justify-content-between flex-wrap">
            <div className="filter_gender  ">
              <div className="filter text-center">
                <h3>Gender</h3>
                <div className="gender d-flex justify-content-between ">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="gender"
                    value={"All"}
                    onChange={(e) => setGender(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Male`}
                    name="gender"
                    value={"Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Female`}
                    name="gender"
                    value={"Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="filter_newold ">
              <h3> Value</h3>
              <Dropdown className="text-center">
                <Dropdown.Toggle className="dropdown_btn" id="dropdown-basic">
                  <i class="fa-solid fa-sort"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSort("new")}>
                    New
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSort("old")}>
                    Old
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="filter_status ">
              <div className="status text-center">
                <h3>Status</h3>
                <div className="status_radio d-flex justify-content-between flex-wrap">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="status"
                    value={"All"}
                    onChange={(e) => setStatus(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Active`}
                    name="status"
                    value={"Active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Inactive`}
                    name="status"
                    value={"Inactive"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showspin ? (
          <Spiner />
        ) : (
          <Tables
            userdata={userdata}
            deleteUser={deleteUser}
            userGet={userGet}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            page={page}
            pageCount={pageCount}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default Home;
