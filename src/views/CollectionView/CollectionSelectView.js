import React from 'react';
import { store } from '../../main';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select';
import { actions as appActions } from '../../redux/modules/app';
import { actions as imageActions } from '../../redux/modules/images';
import classes from './CollectionView.scss';

const mapStateToProps = (state) => ({
  viewState: state.images.get('collections')
});

export class CollectionSelectView extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.selectCollection = this.selectCollection.bind(this);
  }

  selectCollection(selection) {
    store.dispatch(appActions.setLoadingState(true, 'Loading collection'));
    this.props.setCollection({
      id: selection.value,
      label: selection.label
    });
    this.props.loadImages(undefined, selection.value);
    store.dispatch(push('/collections/' + selection.value));
  }

  componentWillMount() {
    if (this.props.viewState.get('collections').length === 0) {
      store.dispatch(appActions.setLoadingState(true, 'Getting collections'));
    }
  }

  componentDidMount() {
    if (this.props.viewState.get('collections').length === 0) {
      this.props.loadCollections();
    }
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Select an image collection</h2>
        </div>
        <div className={classes.collectionSelect}>
          <h4>Select an image collection to view or upload images to using the dropdown below: </h4>
          <Select
            options={this.props.viewState.get('collections')}
            onChange={this.selectCollection}
            />
        </div>
        <div>
          <h4>To create a new image collection, click the 'New Collection' button below.</h4>
          <LinkContainer to={{pathname: '/collections/new'}}>
            <Button bsSize={'large'} bsStyle={'primary'}>New Collection</Button>
          </LinkContainer>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps, imageActions)(CollectionSelectView);
