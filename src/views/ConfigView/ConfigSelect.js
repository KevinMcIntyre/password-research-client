import React from 'react';
import { store } from '../../main';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select';
import { actions as appActions } from '../../redux/modules/app';
import { actions as configActions } from '../../redux/modules/config.js';
import classes from '../CollectionView/CollectionView.scss';

const mapStateToProps = (state) => ({
  viewState: state.config
});

export class ConfigSelect extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.selectConfig = this.selectConfig.bind(this);
  }

  selectConfig(selection) {
    store.dispatch(appActions.setLoadingState(true, 'Loading configuration images...'));
    this.props.selectConfig({
      id: selection.value,
      label: selection.label
    });
    this.props.loadConfigImages(selection.value);
    store.dispatch(push('/configurations/' + selection.value));
  }

  componentWillMount() {
    if (this.props.viewState.get('configs').length === 0) {
      store.dispatch(appActions.setLoadingState(true, 'Getting configurations'));
    }
  }

  componentDidMount() {
    if (this.props.viewState.get('configs').length === 0) {
      this.props.loadConfigs();
    }
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Select a Pass-Image Test Configuration</h2>
        </div>
        <div className={classes.collectionSelect}>
          <h4>Select a pass-image test configuration to view using the dropdown below: </h4>
          <Select
            options={this.props.viewState.get('configs')}
            onChange={this.selectConfig}
            />
        </div>
        <div>
          <h4>To create a new pass-image test configuration, click the 'New Configuration' button below.</h4>
          <LinkContainer to={{pathname: '/configurations/new'}}>
            <Button bsSize={'large'} bsStyle={'primary'}>New Configuration</Button>
          </LinkContainer>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps, configActions)(ConfigSelect);
