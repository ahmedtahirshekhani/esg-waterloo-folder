import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, Image } from "react-bootstrap";
import axios from "axios";
import foldericon from "../img/folder-icon.png";
import plus from "../img/plus.png";
import logo from "../img/uw-logo.png";
import "./dndPolyfill";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import withScrolling from "react-dnd-scrollzone";

class CreateFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      listfolders: [],
      errexist: false,
      errexistreason: "Folder name already exist",
      emptyFolderName: false,
      emptyFolderNameRsn: "Folder Name Cannot be empty",
      success: false,
    };
    this.foldername = [];
  }
  componentDidMount = () => {
    axios
      .get(
        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/createfolder.php?userid=" +
          this.props.userid +
          "&cnd=getuserfolders"
      )
      .then((response) => {
        response.data.map((v, i) => {
          this.foldername.push(v.foldername);
        });
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Create New Folder
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Enter Folder Name:</h6>
          <p>
            <input
              required
              type="text"
              value={this.state.name}
              onChange={(e) =>
                this.setState({
                  name: e.target.value,
                  errexist: false,
                  success: false,
                })
              }
            />
            {this.state.errexist ? (
              <div style={{ color: "red" }}>{this.state.errexistreason}</div>
            ) : (
              ""
            )}
            {this.state.emptyFolderName ? (
              <div style={{ color: "red" }}>
                {this.state.emptyFolderNameRsn}
              </div>
            ) : (
              ""
            )}
          </p>
          {this.state.success ? (
            <div style={{ color: "blue", fontStyle: "italic" }}>
              "Folder successfully created!"
            </div>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-primary"
            onClick={() => {
              if (this.foldername.includes(this.state.name)) {
                console.log("Folder Name: ", this.foldername);

                this.setState({ errexist: true });
              } else {
                if (this.state.name.length == 0) {
                  this.setState({ emptyFolderName: true });
                } else {
                  axios
                    .get(
                      "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/createfolder.php?userid=" +
                        this.props.userid +
                        "&foldername=" +
                        this.state.name +
                        "&cnd=createfolder"
                    )
                    .then((response) => {
                      this.props.addfolder(this.state.name);
                      this.foldername.push(this.state.name);
                      this.setState({ name: "", success: true });
                    })
                    .catch((err) => console.log(err));
                }
              }
            }}
          >
            Create
          </Button>
          <Button className="btn-danger" onClick={this.props.onHide}>
            Close
          </Button>
          {/* onClick={this.props.onHide} */}
        </Modal.Footer>
      </Modal>
    );
  }
}
class Instruction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {};
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Instructional Prompts:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              Direct click on folder: This will show the saved links in the
              folder.
            </li>
            <li>
              3 sec hold on folder: This will give an option to rename, export
              to share, and delete folder.
            </li>
            <li>
              3 second hold on link under Main Directory: Save link to
              particular folder.
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={this.props.onHide}>
            Close
          </Button>
          {/* onClick={this.props.onHide} */}
        </Modal.Footer>
      </Modal>
    );
  }
}

class Home extends Component {
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
      top_b: 0,
      left_b: 0,
      rename: -1,
      changeName: "",
      changenameexist: false,
      seemorecount: 1,
      folderviewthreshhold: 5,
      bookmark_dropdown: [],
      instruction: false,
    };

    dragstartobj = {};
  }

  afteroutsideclick = (e) => {
    try {
      if (!document.getElementById("menu").contains(e.target)) {
        // Clicked outside the box

        let idx = this.state.menuclass.indexOf("show");
        this.state.menuclass[idx] = "hidden";

        let idx_b = this.state.bookmark_dropdown.indexOf("show");
        this.state.bookmark_dropdown[idx_b] = "hidden";

        this.setState({
          menuclass: this.state.menuclass,
          bookmark_dropdown: this.state.bookmark_dropdown,
        });
      }
    } catch (err) {
      //console.log(err)
      //error output
    }
  };
  componentDidMount = () => {
    window.addEventListener("click", this.afteroutsideclick);
    // const dragger = new Draggerjs("#drag-autoscroll", {
    //   draggable: ".draggable-box",
    //   autoscroll: true,
    // });
    // dragger.on("dragstart", (e) => {
    //   const target = e.target;
    //   if (e.isDraggableElement) {
    //     // prevent mobile from scrolling
    //     // when dragging draggable element
    //     e.preventDefault();
    //     // target.classList.add("grabbed");
    //     // if (target.classList.contains("center")) {
    //     //   target.classList.remove("center");
    //     // }
    //   }
    // });

    // dragger.on("dragend", (e) => {
    //   // if (e.isDraggableElement) {
    //   //   e.target.classList.remove("grabbed");
    //   // }
    // });
    // if ("removeDraggerListener" === true) {
    //   dragger.destroy();
    // }
    axios
      .get(
        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/getbookmarkeddata.php?userid=" +
          this.props.match.params.id
      )
      .then((response) => {
        let list = [];
        response.data.map((v, i) => {
          list.push(v.object_id);
        });
        axios
          .get(
            "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?userid=" +
              this.props.match.params.id +
              "&cnd=getdatauserid"
          )
          .then((response) => {
            let notinbookmark = [];
            response.data.map((k, l) => {
              //console.log("index", list.indexOf(k.objectid));
              if (
                list.indexOf(k.objectid) == -1 &&
                notinbookmark.indexOf(k.objectid) == -1
              ) {
                axios
                  .get(
                    "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/deletefoldercontent.php?objectid=" +
                      k.objectid +
                      "&userid=" +
                      this.props.match.params.id +
                      "&cnd=allfold"
                  )
                  .then((response) => {
                    notinbookmark.push(k.objectid);
                  })
                  .catch((err) => console.log(err));
              }
            });
          })

          .catch((err) => console.log(err));

        this.setState({ bookmarkeddata: response.data, objectids: list });

        this.state.objectids.map((m, n) => {
          let x = [];
          axios
            .get(
              "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/getobject.php?id=" +
                m
            )
            .then((res) => {
              //console.log("RES", res.data[0]);
              this.state.objectdata.push(res.data[0]);
              this.state.bookmark_dropdown.push("hidden");
              this.setState({ objectdata: this.state.objectdata });
            })

            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
    axios
      .get(
        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/createfolder.php?userid=" +
          this.props.match.params.id +
          "&cnd=getuserfolders"
      )
      .then((response) => {
        response.data.map((v, i) => {
          this.state.folders.push(v.foldername);
          this.state.menuclass.push("hidden");
        });
        this.setState({
          folders: this.state.folders,
          menuclass: this.state.menuclass,
        });
      })
      .catch((err) => console.log(err));
  };
  onDragStart = (ev, id) => {
    this.dragstartobj = id;
    //console.log("Touch");
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDrop = (ev, folder) => {
    axios
      .get(
        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?objectid=" +
          this.dragstartobj.id +
          "&userid=" +
          this.props.match.params.id +
          "&foldername=" +
          folder +
          "&cnd=validate"
      )
      .then((response) => {
        //console.log(response.data);
        if (response.data.length == []) {
          axios
            .get(
              "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?objectid=" +
                this.dragstartobj.id +
                "&userid=" +
                this.props.match.params.id +
                "&foldername=" +
                folder +
                "&cnd=transfer"
            )
            .then((response) => {
              //console.log("Successfully Transferred");
            })
            .catch((err) => console.log(err));
        } else {
          //console.log("Already there!");
        }
      })
      .catch((err) => console.log(err));
  };

  validate_folder_has_content = (oid, uid, foldername) => {
    axios
      .get(
        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?objectid=" +
          oid +
          "&userid=" +
          uid +
          "&foldername=" +
          foldername +
          "&cnd=validate"
      )
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log(err));
  };

  make_a_link = (post_type, post_name) => {
    let link =
      "https://esg-reporting.uwaterloo.ca/" + post_type + "/" + post_name;
    return link;
  };

  getbookmarklist = () => {
    if (this.state.objectdata.length != 0) {
      //console.log("Object DAta", this.state.objectdata)
      let list = [];
      this.state.objectdata.map((v, i) => {
        if (v != undefined) {
          list.push(
            <li
              key={i}
              className="item draggable"
              id="drag-autoscroll"
              draggable
              // onTouchStart={(e) => {
              //   this.onDragStart(e, this.state.objectdata[i]);
              // }}
              onDragStart={(e) => {
                this.onDragStart(e, this.state.objectdata[i]);
              }}
            >
              {/* {console.log("Object Data: ", v, i)} */}
              <a
                href={this.make_a_link(
                  this.state.objectdata[i].post_type,
                  this.state.objectdata[i].post_name
                )}
                className="bookmark-item"
                target="_blank"
                onMouseOver={() => {
                  this.state.bookmark_dropdown.map((j, k) => {
                    this.state.bookmark_dropdown[k] = "hidden";
                  });

                  this.setState({
                    bookmark_dropdown: this.state.bookmark_dropdown,
                  });
                }}
                onContextMenu={(e) => {
                  e.preventDefault();

                  this.state.bookmark_dropdown[i] = "show";

                  this.state.bookmark_dropdown.map((j, k) => {
                    if (i != k) {
                      this.state.bookmark_dropdown[k] = "hidden";
                    }
                  });
                  let idx = this.state.menuclass.indexOf("show");
                  this.state.menuclass[idx] = "hidden";

                  this.setState({
                    bookmark_dropdown: this.state.bookmark_dropdown,
                    top_b: e.nativeEvent.clientY,
                    left_b: e.nativeEvent.clientX,
                    menuclass: this.state.menuclass,
                  });

                  // this.setState({
                  //   menuclass: this.state.menuclass,
                  //   top: e.nativeEvent.clientY,
                  //   left: e.nativeEvent.clientX,
                  // });
                }}
              >
                <span>{this.state.objectdata[i].post_title}</span>
                <i className="fa fa-angle-right "></i>
              </a>
              <div>
                <i
                  style={{ color: "red", fontSize: "18px" }}
                  className="fa fa-trash"
                  onClick={() => {
                    console.log(this.state.objectdata[i]);
                    let id = parseInt(this.state.objectdata[i].id);
                    axios
                      .get(
                        "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/deletebookmark.php?id=" +
                          id
                      )
                      .then((res) => {
                        axios
                          .get(
                            "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/deletefoldercontent.php?objectid=" +
                              id +
                              "&userid=" +
                              this.props.match.params.id +
                              "&cnd=allfold"
                          )
                          .then((response) => {
                            this.setState({
                              render: true,
                              deleteid: id,
                            });
                          })
                          .catch((err) => console.log("Error1: ", err));
                      })
                      .catch((err) => console.log("Error2: ", err));
                  }}
                ></i>
              </div>

              <ul
                tabIndex="0"
                id="menu"
                style={{
                  position: "absolute",
                  zIndex: "1",
                  background: "black",
                  listStyle: "none",
                  borderRadius: "5px",
                  textAlign: "left",
                }}
                className={this.state.bookmark_dropdown[i] + " dropdown-menu "}
              >
                <li
                  key="0"
                  className="dropdown-item "
                  style={{
                    fontWeight: 700,
                    background: "#5c5c5c",
                    color: "white",
                  }}
                >
                  Select Folder to Transfer
                </li>
                {this.getFoldersInDropDown(this.state.objectdata[i].id)}
              </ul>
            </li>
          );
        }
      });
      return list;
    } else {
      return (
        <p style={{ fontStyle: "italic", textAlign: "center" }}>
          No Items Found!
        </p>
      );
    }
  };
  getFoldersInDropDown = (id) => {
    let list = [];
    this.state.folders.map((v, i) => {
      list.push(
        <li
          key={i + 1}
          className="dropdown-item list-item "
          onClick={() => {
            axios
              .get(
                "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?objectid=" +
                  id +
                  "&userid=" +
                  this.props.match.params.id +
                  "&foldername=" +
                  v +
                  "&cnd=validate"
              )
              .then((response) => {
                //console.log(response.data);
                if (response.data.length == []) {
                  axios
                    .get(
                      "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/addtofolder.php?objectid=" +
                        id +
                        "&userid=" +
                        this.props.match.params.id +
                        "&foldername=" +
                        v +
                        "&cnd=transfer"
                    )
                    .then((response) => {
                      //console.log("Successfully Transferred");
                    })
                    .catch((err) => console.log(err));
                } else {
                  //console.log("Already there!");
                }
              })
              .catch((err) => console.log(err));
          }}
        >
          {v}
        </li>
      );
    });
    return list;
  };
  droplist = (e) => {
    e.preventDefault();
    console.log("Its working");
  };

  getFolders = () => {
    if (this.state.folders.length != 0) {
      let listoffolders = [];

      if (
        this.state.folders.length >=
        this.state.folderviewthreshhold * this.state.seemorecount
      ) {
        for (
          let i = 0;
          i < this.state.folderviewthreshhold * this.state.seemorecount;
          i++
        ) {
          listoffolders.push(this.state.folders[i]);
        }
      } else {
        for (let i = 0; i < this.state.folders.length; i++) {
          listoffolders.push(this.state.folders[i]);
        }
      }
      //console.log("List of FOlders", listoffolders);
      let list = [];
      listoffolders.map((v, i) => {
        list.push(
          <div style={{ position: "relative" }}>
            <Row
              key={i}
              style={{ cursor: "pointer", padding: "10px" }}
              className="createFolder droppable"
              //onTouchEnd={(e) => this.onDrop(e, v)}
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => this.onDrop(e, v)}
              onClick={() => {
                if (this.state.rename == -1) {
                  let str =
                    "/foldersystem/" + this.props.match.params.id + "/" + v;
                  this.props.history.push(str);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                this.state.menuclass[i] = "show";
                this.state.menuclass.map((j, k) => {
                  if (i != k) {
                    this.state.menuclass[k] = "hidden";
                  }
                });

                let idx = this.state.bookmark_dropdown.indexOf("show");
                this.state.bookmark_dropdown[idx] = "hidden";

                this.setState({
                  bookmark_dropdown: this.state.bookmark_dropdown,
                  menuclass: this.state.menuclass,
                  top: e.nativeEvent.clientY,
                  left: e.nativeEvent.clientX,
                });
              }}
            >
              <Col style={{ textAlign: "left" }}>
                <img
                  src={foldericon}
                  alt="folder-icon"
                  style={{ width: "10%", marginRight: "5px" }}
                />
                {this.state.rename == i ? (
                  <span>
                    <input
                      type="text"
                      autoFocus
                      value={this.state.changeName}
                      onChange={(e) => {
                        this.setState({
                          changeName: e.target.value,
                          changenameexist: false,
                        });
                      }}
                      style={{ width: "60%" }}
                    />
                    <button
                      className="btn-xs btn-primary"
                      onClick={() => {
                        if (this.state.folders[i] != this.state.changeName) {
                          if (
                            this.state.folders.includes(this.state.changeName)
                          ) {
                            this.setState({ changenameexist: true });
                          } else {
                            axios
                              .get(
                                "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/updatename.php?id=" +
                                  this.props.match.params.id +
                                  "&prevname=" +
                                  this.state.folders[i] +
                                  "&newname=" +
                                  this.state.changeName +
                                  "&cnd=rename"
                              )
                              .then((res) => {})

                              .catch((err) => console.log(err));
                            this.state.folders[i] = this.state.changeName;
                            this.setState({
                              folders: this.state.folders,
                              rename: -1,
                              changeName: "",
                            });
                          }
                        } else {
                          this.setState({
                            folders: this.state.folders,
                            rename: -1,
                            changeName: "",
                          });
                        }
                      }}
                    >
                      Save
                    </button>
                    {this.state.changenameexist ? (
                      <div style={{ color: "red" }}>
                        "Error: Name already exist!"
                      </div>
                    ) : (
                      ""
                    )}
                  </span>
                ) : (
                  <span>{v}</span>
                )}
              </Col>
            </Row>

            <ul
              tabIndex="0"
              id="menu"
              style={{
                position: "absolute",
                zIndex: "1",
                background: "black",
                listStyle: "none",
                borderRadius: "5px",
                textAlign: "left",
              }}
              className={this.state.menuclass[i] + " dropdown-menu"}
            >
              <li
                key={i + 1}
                className="dropdown-item list-item"
                onClick={(e) => {
                  this.setState({ rename: i, changeName: v });
                }}
              >
                Rename
              </li>
              <li
                key={i + 2}
                className="dropdown-item list-item"
                onClick={() => {
                  this.state.menuclass[i] = "hidden";
                  let cnd = "downloadtoexcel";
                  window.open(
                    "/foldersystem/" +
                      this.props.match.params.id +
                      "/" +
                      this.state.folders[i] +
                      "/" +
                      cnd,
                    "_blank",
                    ""
                  );
                  //this.props.history.push();
                }}
              >
                Export to Share
              </li>
              <li
                key={i + 3}
                className="dropdown-item list-item"
                onClick={() => {
                  axios
                    .get(
                      "https://esg-reporting.uwaterloo.ca/phpfiles-foldersystem/updatename.php?id=" +
                        this.props.match.params.id +
                        "&prevname=" +
                        this.state.folders[i] +
                        "&newname=" +
                        this.state.changeName +
                        "&cnd=delete"
                    )
                    .then((res) => {})

                    .catch((err) => console.log(err));
                  let idx = this.state.folders.indexOf(this.state.folders[i]);
                  this.state.folders.splice(idx, 1);
                  this.setState({ folders: this.state.folders });
                }}
              >
                Delete
              </li>
            </ul>
          </div>
        );
      });

      if (
        this.state.folders.length >
        this.state.folderviewthreshhold * this.state.seemorecount
      ) {
        list.push(
          <Row
            style={{ cursor: "pointer" }}
            onClick={() => {
              this.setState({ seemorecount: this.state.seemorecount + 1 });
            }}
          >
            <Col style={{ textAlign: "left" }}>
              <img
                src={plus}
                alt="plus"
                style={{ width: "10%", marginRight: "5px" }}
              />{" "}
              <strong>See More</strong>
            </Col>
          </Row>
        );
      }

      return list;
    } else {
      return <p style={{ fontStyle: "italic" }}>No Folders Found!</p>;
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
    return (
      <Container style={{ marginTop: "63px" }}>
        {/* <div style={{ textAlign: "center", padding: "20px" }}>
          <a href="https://esg-reporting.uwaterloo.ca/">
            <Image style={{ width: "30%" }} src={logo} responsive />
          </a>
        </div> */}
        <Row>
          <Col
            sm={3}
            style={{
              textAlign: "center",
              background: "#e5e5e5",
              paddingTop: "10px",
            }}
          >
            <Row style={{ marginBottom: "20px" }}>
              <Row>
                <h5>Create Folder</h5>
              </Row>
              <Row
                style={{ cursor: "pointer", padding: "10px" }}
                onClick={() => {
                  this.setState({ createFolder: true });
                }}
              >
                <Col>
                  <div
                    className="createFolder"
                    style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  >
                    <img
                      src={foldericon}
                      alt="folder-icon"
                      style={{ width: "20%" }}
                    />
                    <img
                      src={plus}
                      alt="folder-icon"
                      style={{ width: "20%" }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "grey",
                      fontStyle: "italic",
                      marginBottom: "10px",
                    }}
                  >
                    "Click here to 'Create New Folder' instantly"
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <button
                    className="btn-xs btn-danger btn-instruction"
                    onClick={() => {
                      this.setState({ instruction: true });
                    }}
                  >
                    How to use in mobile/tablet?
                  </button>
                </Col>
              </Row>
            </Row>
            <Row style={{ marginBottom: "10px" }} className="folder-list">
              <Row>
                <h5>Your Folders</h5>
              </Row>

              {this.getFolders()}

              <Row>
                <Col>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "grey",
                      fontStyle: "italic",
                    }}
                  >
                    "Right click on folder to Rename or Delete"
                  </div>
                </Col>
              </Row>
            </Row>
          </Col>
          <Col
            sm={9}
            style={{
              paddingTop: "10px",
            }}
          >
            <Row>
              <h6>Main Directory</h6>
            </Row>
            <div>
              <ul className="bookmark-list characters ">
                {this.getbookmarklist()}
              </ul>
            </div>
          </Col>
        </Row>
        {this.state.createFolder ? (
          <CreateFolder
            show={this.state.createFolder}
            onHide={() => this.setState({ createFolder: false })}
            userid={this.props.match.params.id}
            addfolder={(e) => {
              this.state.folders.push(e);
              this.setState({ folders: this.state.folders });
            }}
          />
        ) : (
          ""
        )}
        {this.state.instruction ? (
          <Instruction
            show={this.state.instruction}
            onHide={() => this.setState({ instruction: false })}
            userid={this.props.match.params.id}
          />
        ) : (
          ""
        )}
      </Container>
    );
  }
}

export default Home;
