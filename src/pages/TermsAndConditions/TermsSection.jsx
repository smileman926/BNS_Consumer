import React from 'react'
import PropTypes from 'prop-types'

function TermsSection(props) {
  const { number, description, children } = props;
  return (
    <div className="d-table sub-section">
      <div className="d-table-row">
        <div className="d-table-cell section-number"> {number} </div>
        <div className="d-table-cell"> {children} </div>
      </div>
    </div>
  )
}

TermsSection.propTypes = {

}

export default TermsSection

