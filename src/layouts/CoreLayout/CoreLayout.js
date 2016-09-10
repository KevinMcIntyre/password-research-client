import React from 'react';
import { connect } from 'react-redux';
import TopNav from './TopNav.js';
import Spinner from 'react-spinkit';
import '../../styles/core.scss';

const mapStateToProps = (state) => ({
  viewState: state.app
});

export class CoreLayout extends React.Component {
  constructor() {
    super();
  }

  render() {
    const loading = (
      <div className='loadingContainer'>
        <div className='loadingDiv'>
          <h2>{ this.props.viewState.get('loadingText') }</h2>
          <div className='spinnerDiv'>
            <Spinner spinnerName='three-bounce' noFadeIn={true}/>
          </div>
        </div>
      </div>
    );
    return (
      <div className='page-container'>
        <div className='view-container'>
          <TopNav isTesting={this.props.viewState.get('isTesting')} />
          {this.props.viewState.get('loading') ? loading : ''}
          <div className={this.props.viewState.get('loading') ? 'loading-children' : ''}>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, undefined)(CoreLayout);
