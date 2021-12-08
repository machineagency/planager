import React from "react";

import "./Download.css";

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      fileType: "json",
      fileDownloadUrl: null,
    };
  }
  download(e) {
    e.preventDefault();
    // Prepare the file
    let output = this.props.inports.file.value;

    // if (this.state.fileType === "json") {
    //   output = JSON.stringify({ states: this.state.data }, null, 4);
    // } else if (this.state.fileType === "csv") {
    //   // Prepare data:
    //   let contents = [];
    //   contents.push(["State", "Electors"]);
    //   this.state.data.forEach((row) => {
    //     contents.push([row.state, row.electors]);
    //   });
    //   output = this.makeCSV(contents);
    // } else if (this.state.fileType === "text") {
    //   // Prepare data:
    //   output = "";
    //   this.state.data.forEach((row) => {
    //     output += `${row.state}: ${row.electors}\n`;
    //   });
    // }

    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    this.setState({ fileDownloadUrl: fileDownloadUrl }, () => {
      this.dofileDownload.click();
      URL.revokeObjectURL(fileDownloadUrl); // free up storage--no longer needed.
      this.setState({ fileDownloadUrl: "" });
    });
  }
  render() {
    return (
      <div className='background'>
        <div id='downloadButton' onClick={this.download.bind(this)}>
          Download
        </div>
        <a
          className='hidden'
          download={"file"}
          href={this.state.fileDownloadUrl}
          ref={(e) => (this.dofileDownload = e)}>
          download it
        </a>
      </div>
    );
  }
}
