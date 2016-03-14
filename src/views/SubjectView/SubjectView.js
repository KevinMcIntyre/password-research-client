import React, { PropTypes } from 'react';

function SubjectView({ children }) {
  return (
    <div>
        {children}
    </div>
  );
}

SubjectView.propTypes = {
  children: PropTypes.element
};

export default SubjectView;
