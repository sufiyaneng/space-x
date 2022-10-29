import React, { useEffect } from "react";
import { Form, Navbar, Table } from "react-bootstrap";
import logo from "./logo.svg";
import nvbackground from "./nv-background.jpg";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import './capsules.css'
const Capsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  //   -------------------------- filter starts ---------------------------------------
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const handleFilter = (e)=>{
    e.preventDefault();
    getAllCapsules(date, status, type); 
  }
  // -------------------------- pagination start -------------------//
  const updatePageItems = (pageNo) => {
    const end = pageNo * 10;
    const start = end - 10;
    const items = capsules?.slice(start, end);
    setPageItems(items);
  };
  useEffect(() => {
    const items = capsules?.slice(0, 10);
    setPageItems(items);
  }, [capsules]);

  //---------- handle page change ---------------//
  const handlePageChange = (data) => {
    updatePageItems(data.selected + 1);
  };
  //   ------------------------------ pagination ends ---------------------
  const URL = "https://api.spacexdata.com/v3/capsules";
  const getAllCapsules = async (...args) => {
    try {
      let queryURL = URL + "?";
      let str1 =
        args[0] !== null
          ? queryURL.concat(
              `${
                queryURL.endsWith("?")
                  ? `original_launch=${args[0]}`
                  : `&original_launch=${args[0]}`
              }`
            )
          : queryURL;
      let str2 =
        args[1] !== ""
          ? str1.concat(
              `${
                str1.endsWith("?") ? `status=${args[1]}` : `&status=${args[1]}`
              }`
            )
          : str1;
      let str3 =
        args[2] !== ""
          ? str2.concat(
              `${str2.endsWith("?") ? `type=${args[2]}` : `&type=${args[2]}`}`
            )
          : str2;


      let resp;
      if (args.length > 0) {
        resp = await axios.get(str3);
      } else {
        resp = await axios.get(URL);
      }

      setCapsules(resp.data);
      setPageCount(Math.ceil(resp.data?.length / 10));
      updatePageItems(1);
    } catch (error) {
      swal("something went wrong", "", "error");
    }
  };
  useEffect(() => {
    getAllCapsules();
  }, []);

  
  return (
    <>
      <div className="container-fluid mt-1">
        <div className="row">
          <div className="col-12">
            <Navbar
              className="bg d-flex justify-content-end"
              style={{ height: "300px",  backgroundImage: `url(${nvbackground})`, backgroundSize: 'cover', width: '100%' , backgroundRepeat: "no-repeat" }}
            >
             
                <Navbar.Brand href="#home" className="d-flex justify-content-end">
                  <img
                    alt=""
                    src={logo}

                    className="d-inline-block align-top brand-image"
                    style={{
                      width:'70vw'
                    }}
                  />{" "}
                </Navbar.Brand>
           
            </Navbar>
          </div>
          <div className="col-12">
            <Form onSubmit={(e)=>handleFilter(e)}>
              <div className="row mt-5">
                <div className="col-12 col-md-6 col-lg-4">
                  {" "}
                  <Form.Group
                    className="mb-3 "
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      className="shadow p-3 mb-4 bg-body rounded"
                      type="text"
                      placeholder="Status"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  {" "}
                  <Form.Group
                    className="mb-3 "
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control
                      className="shadow p-3 mb-4 bg-body rounded"
                      type="datetime-local"
                      onChange={(e) =>
                        setDate(new Date(e.target.value).toISOString())
                      }
                    />
                  </Form.Group>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <Form.Group
                    className="mb-3 "
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      className="shadow p-3 mb-4 bg-body rounded"
                      type="text"
                      placeholder="Type"
                      onChange={(e) => setType(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <Form.Group
                    className="mb-3 "
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>&nbsp;</Form.Label>
                    <button type="submit" className="btn btn-dark btn-change " style={{
                      width:'150px',
                      fontSize:'24px',
                      color:'white'
                    }} >Filter</button>
                  </Form.Group>
                </div>
              </div>
            </Form>
          </div>
          <div className="col-12 shadow p-3 mb-4 bg-body rounded">
            <div className="resp_wrapper">
            <Table striped bordered hover>
              <thead className="text-center">
                <tr>
                  <th>Capsule Serial</th>
                  <th>Status</th>
                  <th>Original Launch</th>
                  <th>Mission Name</th>
                  <th>Type</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {pageItems &&
                  pageItems?.map((capsule, index) => {
                    return (
                      
                        <tr key={index}>
                          <td>{capsule.capsule_serial}</td>
                          <td>{capsule.status}</td>
                          <td>{capsule.original_launch}</td>
                          <td>{capsule?.missions[0]?.name}</td>
                          <td>{capsule.type}</td>
                          <td>{capsule.details}</td>
                        </tr>
                    
                    );
                  })}
              </tbody>
            </Table>
            </div>
           
            <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageChange}
              previousLabel={"<"}
              nextLabel={">"}
              pageRangeDisplayed={5}
              containerClassName={"pagination justify-content-end"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Capsules;
