import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";
import logo from "../img/uw-logo.png";

class SingleFolder extends Component {
  constructor(props) {
    super(props);
    let dragstartobj;
    this.state = {
      bookmarkeddata: [],
      objectids: [],
      objectdata: [],
      render: false,
      deleteid: "",
      createFolder: false,
      folders: [],
      menuclass: [],
      top: 0,
      left: 0,
      rename: -1,
      changeName: "",
      changenameexist: false,
    };

    dragstartobj = {};
    let listcreated = false;
  }

  componentDidMount = () => {
    //console.log(this.props.match.params);
    axios
      .get(
        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?userid=" +
          this.props.match.params.id +
          "&foldername=" +
          this.props.match.params.foldername +
          "&cnd=getdata"
      )
      .then((response) => {
        let list = [];
        response.data.map((v, i) => {
          list.push(v.objectid);
        });

        this.setState({ bookmarkeddata: response.data, objectids: list });

        this.state.objectids.map((m, n) => {
          let x = [];
          axios
            .get(
              "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/getobject.php?id=" +
                m
            )
            .then((res) => {
              //console.log("RES", res.data[0])
              this.state.objectdata.push(res.data[0]);
              this.setState({ objectdata: this.state.objectdata });
            })

            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
    try {
      if (this.props.match.params.cnd == "downloadtoexcel") {
        setTimeout(() => {
          this.exportToExcel();
          window.close();
        }, 5000);
      }
    } catch (err) {
      console.log("err");
    }
  };

  make_a_link = (post_type, post_name) => {
    let link =
      "https://esg-reporting.uwaterloo.ca/" + post_type + "/" + post_name;
    return link;
  };
  postDatainTable = () => {
    let list = [];
    this.state.objectdata.map((v, i) => {
      if (v != undefined) {
        list.push(
          <tr>
            <td>{this.state.objectdata[i].post_name}</td>
            <td>
              {this.make_a_link(
                this.state.objectdata[i].post_type,
                this.state.objectdata[i].post_name
              )}
            </td>
          </tr>
        );
      }
    });
    return list;
  };
  exportToExcel = () => {
    const uri = "data:application/vnd.ms-excel;base64,";
    const template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    };

    const format = function (s, c) {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      });
    };

    let htmls = document.querySelector("#tbl_exporttable_to_xls").outerHTML;

    const ctx = {
      worksheet: "Worksheet",
      table: htmls,
    };

    const link = document.createElement("a");
    link.download = this.props.match.params.foldername + ".xls";
    link.href = uri + base64(format(template, ctx));
    link.click();
  };

  getbookmarklist = () => {
    if (this.state.objectdata.length != 0) {
      let list = [];
      this.state.objectdata.map((v, i) => {
        if (v != undefined) {
          list.push(
            <li key={i} className="item">
              <a
                href={this.make_a_link(
                  this.state.objectdata[i].post_type,
                  this.state.objectdata[i].post_name
                )}
                className="bookmark-item"
                target="_blank"
              >
                <span>{this.state.objectdata[i].post_title}</span>
                <i className="fa fa-angle-right "></i>
              </a>
              <div>
                <i
                  style={{ color: "red", fontSize: "18px" }}
                  className="fa fa-trash"
                  onClick={() => {
                    // console.log(this.state.objectdata[i].id)
                    axios
                      .get(
                        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/deletefoldercontent.php?objectid=" +
                          this.state.objectdata[i].id +
                          "&cnd=singlefold" +
                          "&foldername=" +
                          this.props.match.params.foldername +
                          "&userid=" +
                          this.props.match.params.id
                      )
                      .then((response) => {
                        this.setState({
                          render: true,
                          deleteid: this.state.objectdata[i].id,
                        });
                      })
                      .catch((err) => console.log(err));
                  }}
                ></i>
              </div>
            </li>
          );
        }
      });
      this.listcreated = true;
      return list;
    } else {
      return (
        <p style={{ fontStyle: "italic", textAlign: "center" }}>
          No Items Found!
        </p>
      );
    }
    //console.log("Object DAta", this.state.objectdata)
  };

  downloadandreturn = () => {
    this.listcreated = false;
    try {
      if (this.props.match.params.cnd == "downloadtoexcel") {
        setTimeout(() => {
          this.exportToExcel();
        }, 1000);

        //console.log("found");
      }
    } catch (err) {
      console.log("err");
    }
  };

  render() {
    if (this.state.render == true) {
      this.state.objectdata.map((v, i) => {
        if (v != undefined) {
          if (v.id == this.state.deleteid) {
            delete this.state.objectdata[i];
            this.setState({ objectdata: this.state.objectdata, render: false });
          }
        }
      });
    }

    try {
      if (this.props.match.params.cnd == "downloadtoexcel") {
        return (
          <Container>
            <h1>Downloading.... Please Wait</h1>
            <table id="tbl_exporttable_to_xls" style={{ display: "none" }}>
              <tr>
                <th>Post Title</th>
                <th>Post URL</th>
              </tr>
              {this.postDatainTable()}
            </table>
          </Container>
        );
      }
    } catch (err) {
      console.log("err");
    }

    return (
      <Container style={{ marginTop: "63px" }}>
        {/* <div style={{ textAlign: "center", padding: "10px" }}>
          <a href="https://esg-reporting.uwaterloo.ca/">
            <img src={logo} style={{ width: "30%" }} alt="uw-logo" />
          </a>
        </div> */}
        <Row>
          <Col sm={10}>
            <h6>
              <a href={"/foldersystem/" + this.props.match.params.id}>
                Main Directory
              </a>{" "}
              {">"} {this.props.match.params.foldername}
            </h6>
          </Col>
          <Col sm={2}>
            <button
              className="backbutton"
              onClick={() => {
                this.props.history.push(
                  "/foldersystem/" + this.props.match.params.id
                );
              }}
            >
              {"<"} Back To Main
            </button>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              textAlign: "center",
            }}
          >
            <h1 className="foldername-single">
              {this.props.match.params.foldername}
            </h1>
            <Button
              classname="btn btn-primary"
              style={{ marginLeft: "auto", marginRight: "auto" }}
              onClick={() => this.exportToExcel()}
            >
              Export to Share
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <ul className="bookmark-list-rmvscroll characters">
                {this.getbookmarklist()}
              </ul>
            </div>
          </Col>
        </Row>
        <table id="tbl_exporttable_to_xls" style={{ display: "none" }}>
          <tr>
            <th>Post Title</th>
            <th>Post URL</th>
          </tr>
          {this.postDatainTable()}
        </table>
        {/* {this.listcreated ? this.downloadandreturn() : ""} */}
      </Container>
    );
  }
}

export default SingleFolder;
