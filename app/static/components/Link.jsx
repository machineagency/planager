import React from "react";
import "./styles/link.css";

export default class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovering: false };
    this.linkPath = React.createRef(null);
    this.animateMotionRef = React.createRef(null);
    this.animateRef = React.createRef(null);
  }

  calculateBezier() {
    let x1 = this.props.startX;
    let y1 = this.props.startY;
    let x2 = this.props.endX;
    let y2 = this.props.endY;

    return `M${x1},${y1}
    C${x1 + 100},${y1}
    ${x2 - 100},${y2}
    ${x2},${y2}`;
  }
  remove(e) {
    e.preventDefault();
    this.props.removeLink(this.props.id);
  }
  runAnimation() {
    this.animateMotionRef.current.beginElement();
    this.animateRef.current.beginElement();
  }
  render() {
    return (
      <div>
        <svg className='wire'>
          <path
            className='backgroundPath'
            d={this.calculateBezier.bind(this)()}
            onMouseOver={() => this.setState({ hovering: true })}
            onMouseOut={() => this.setState({ hovering: false })}
          />
          <path
            id='wirePath'
            ref={this.linkPath}
            className='linkPath'
            d={this.calculateBezier.bind(this)()}
            onContextMenu={this.remove.bind(this)}
          />
          <circle id='droplet'>
            <animateMotion
              ref={this.animateMotionRef}
              dur='2s'
              repeatCount='1'
              calcMode='spline'
              keySplines='0.4 0 0.2 1'
              keyTimes='0; 1'
              begin='indefinite'>
              <mpath xlinkHref='#wirePath' />
            </animateMotion>
            <animate
              ref={this.animateRef}
              begin='indefinite'
              attributeType='XML'
              attributeName='fill'
              from='#2aa198'
              to='#6c71c4'
              dur='2s'
              repeatCount='1'
            />
          </circle>
        </svg>
      </div>
    );
  }
}
