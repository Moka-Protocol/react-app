import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_SIZE = '16x';
const DEFAULT_COLOR = '#fff';

function Checkmark(props) {
  const color = props.fill ? props.fill : DEFAULT_COLOR;
  const size = props.size ? props.size : DEFAULT_SIZE;

  return (
    <svg fill={color} height={size} viewBox="0 0 24 24" width={size}>
      <path clipRule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fillRule="evenodd"/>
    </svg>
  );
}

export default Checkmark;

Checkmark.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.string
};
