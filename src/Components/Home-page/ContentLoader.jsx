import React from "react";
import styled from "styled-components";

export const ContentLoader = () => {
  return (
    <Wrapper>
      <svg
        className="loader"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background Traces */}

        <g>
          {/* LEFT */}
          <path d="M70 90 H170 V210 H325" className="trace-bg" />
          <path d="M70 180 H170 V230 H325" className="trace-bg" />
          <path d="M70 270 H170 V250 H325" className="trace-bg" />
          <path d="M70 360 H170 V270 H325" className="trace-bg" />

          {/* RIGHT */}
          <path d="M730 90 H630 V210 H475" className="trace-bg" />
          <path d="M730 180 H630 V230 H475" className="trace-bg" />
          <path d="M730 270 H630 V250 H475" className="trace-bg" />
          <path d="M730 360 H630 V270 H475" className="trace-bg" />
        </g>

        {/* Animated Flows */}

        <g>
          <path
            d="M70 90 H170 V210 H325"
            className="trace-flow purple"
          />
          <path
            d="M70 180 H170 V230 H325"
            className="trace-flow blue"
          />
          <path
            d="M70 270 H170 V250 H325"
            className="trace-flow yellow"
          />
          <path
            d="M70 360 H170 V270 H325"
            className="trace-flow green"
          />

          <path
            d="M730 90 H630 V210 H475"
            className="trace-flow blue reverse"
          />
          <path
            d="M730 180 H630 V230 H475"
            className="trace-flow green reverse"
          />
          <path
            d="M730 270 H630 V250 H475"
            className="trace-flow red reverse"
          />
          <path
            d="M730 360 H630 V270 H475"
            className="trace-flow yellow reverse"
          />
        </g>

        {/* Chip */}

        <rect
          x="325"
          y="190"
          width="150"
          height="110"
          rx="22"
          className="chip"
        />

        {/* Pins Left */}

        <g>
          <rect x="318" y="208" width="7" height="10" className="pin" />
          <rect x="318" y="228" width="7" height="10" className="pin" />
          <rect x="318" y="248" width="7" height="10" className="pin" />
          <rect x="318" y="268" width="7" height="10" className="pin" />
        </g>

        {/* Pins Right */}

        <g>
          <rect x="475" y="208" width="7" height="10" className="pin" />
          <rect x="475" y="228" width="7" height="10" className="pin" />
          <rect x="475" y="248" width="7" height="10" className="pin" />
          <rect x="475" y="268" width="7" height="10" className="pin" />
        </g>

        {/* Loading Text */}

        <text
          x="400"
          y="245"
          textAnchor="middle"
          className="loading-text"
        >
          Loading
        </text>

        {/* End Dots */}

        <g>
          <circle cx="70" cy="90" r="5" fill="#000" />
          <circle cx="70" cy="180" r="5" fill="#000" />
          <circle cx="70" cy="270" r="5" fill="#000" />
          <circle cx="70" cy="360" r="5" fill="#000" />

          <circle cx="730" cy="90" r="5" fill="#000" />
          <circle cx="730" cy="180" r="5" fill="#000" />
          <circle cx="730" cy="270" r="5" fill="#000" />
          <circle cx="730" cy="360" r="5" fill="#000" />
        </g>
      </svg>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #090909;
  overflow: hidden;

  .loader {
  width: 780px;
  height: 480px;
  max-width: 100%;
}

  .trace-bg {
    stroke: #2a2a2a;
    stroke-width: 2;
    fill: none;
  }

  .trace-flow {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;

  stroke-dasharray: 40 240;

  filter: drop-shadow(0 0 6px currentColor);

  animation: flow 2s linear infinite;
}

@keyframes flow {
  from {
    stroke-dashoffset: 280;
  }

  to {
    stroke-dashoffset: 0;
  }
}



@keyframes flowRight {
  to {
    stroke-dashoffset: 0;
  }
}

  .purple {
    stroke: #bb00ff;
    color: #bb00ff;
  }

  .blue {
    stroke: #00d9ff;
    color: #00d9ff;
  }

  .green {
    stroke: #00ff48;
    color: #00ff48;
  }

  .yellow {
    stroke: #ffee00;
    color: #ffee00;
  }

  .red {
    stroke: #ff3300;
    color: #ff3300;
  }

  .chip {
    fill: #111;
    stroke: #2c2c2c;
    stroke-width: 2;

    filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.8));
  }

  .pin {
    fill: #8a8a8a;
  }

  .loading-text {
    fill: #d9d9d9;
    font-size: 28px;
    font-family: Arial;
    dominant-baseline: middle;
  }
`;