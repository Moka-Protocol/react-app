import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_SIZE = '25px';
const DEFAULT_COLOR = '#333';

function UpArrow(props) {
  const color = props.fill ? props.fill : DEFAULT_COLOR;
  const size = props.size ? props.size : DEFAULT_SIZE;

  return (
    <svg viewBox="0 0 32 32" height={size} width={size} fill={color}>
      <g>
        <path d="M18,29h-4c-1.1,0-2-0.9-2-2V15H8.4c-0.8,0-1.5-0.5-1.8-1.2S6.4,12.2,7,11.6l8.3-8.3c0.4-0.4,1-0.4,1.4,0l8.3,8.3   c0.6,0.6,0.7,1.4,0.4,2.2s-1,1.2-1.8,1.2H20v12C20,28.1,19.1,29,18,29z"/>
      </g>
    </svg>
  );
}

export default UpArrow;

UpArrow.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.string
};
