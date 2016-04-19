import React, { PropTypes } from 'react';

function CollectionView({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

CollectionView.propTypes = {
  children: PropTypes.element
};

export default CollectionView;
