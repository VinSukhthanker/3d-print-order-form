import React from "react";
import axios from "axios";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorList: [],
      cust: {
        name: "",
        email: "",
        zip_file: null,
        color_material: "",
      },
      message: [],
      success: false,
    };
  }

  componentDidMount() {
    axios
      .get("/api/")
      .then((res) => {
        let colorList = res.data;
        let cust = { ...this.state.cust, color_material: colorList[0].id };
        this.setState({
          colorList: colorList,
          cust: cust,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (event) => {
    let prpt = event.target.name;
    let val = event.target.value;
    let cust = { ...this.state.cust, [prpt]: val };
    this.setState({
      cust: cust,
    });
  };

  handleFile = (event) => {
    let zip_file = event.target.files[0];
    let cust = { ...this.state.cust, zip_file: zip_file };
    this.setState({
      cust: cust,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let cust = this.state.cust;
    let message = [];
    let success = true;
    if (cust.name === "") {
      message.push({
        head: "",
        para: "Please enter your name.",
      });
      success = false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(cust.email)) {
      message.push({
        head: "",
        para: "Please enter a valid E-mail ID.",
      });
      success = false;
    }
    if (cust.zip_file === null) {
      message.push({
        head: "",
        para: "Please upload a file.",
      });
      success = false;
    }
    if (success === true) {
      let cust = this.state.cust;
      let data = new FormData();
      data.append("name", cust.name);
      data.append("email", cust.email);
      data.append("zip_file", cust.zip_file);
      data.append("color_material", cust.color_material);
      axios
        .post("http://localhost:8000/api/", data)
        .then((res) => {
          console.log(res.statusText);
          message.push({
            head: "Thanks for choosing Us!",
            para: "We'll get back to you soon",
          });
        })
        .catch((err) => {
          console.log(err);
          message.push({
            head: "Something went wrong!",
            para: "Please try again!",
          });
          success = false;
        });
    }
    this.setState({
      message: message,
      success: success,
    });
  };
  render() {
    return (
      <div>
        <h1 className="text-white-50 mt-5 text-center">Upload Your Model</h1>
        <form
          className="col-11 col-sm-9 col-md-4 col-xl-3 mx-auto p-3 my-5 border rounded-lg bg-light"
          onSubmit={this.handleSubmit}
        >
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={this.state.cust.name}
              type="name"
              className="form-control"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={this.state.cust.email}
              type="email"
              className="form-control"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <select
              name="color"
              value={this.state.cust.color}
              className="custom-select"
              onChange={this.handleChange}
            >
              {this.state.colorList.map((obj, index) => {
                return (
                  <option key={index} value={obj.id}>
                    {obj.color}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group mb-4">
            <label>Upload Model</label>
            <div className="custom-file">
              <input
                type="file"
                onChange={this.handleFile}
                className="custom-file-input"
                name="filename"
              />
              <label className="custom-file-label">Choose file</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Upload
          </button>
          {this.state.message.map((value, index) => {
            return (
              <div
                className={`alert mt-3 alert-${
                  this.state.success ? "success" : "danger"
                }`}
                key={index}
              >
                <h4 className="alert-heading mb-0">{value.head}</h4>
                <p className="my-0">{value.para}</p>
              </div>
            );
          })}
        </form>
      </div>
    );
  }
}

export default Form;
