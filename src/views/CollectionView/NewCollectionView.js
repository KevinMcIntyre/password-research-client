import React from 'react';
import { store } from '../../main';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import { actions as appActions } from '../../redux/modules/app';
import { actions as imageActions } from '../../redux/modules/images';
import classes from './CollectionView.scss';
import { isBlank } from '../../utils/validation';

const mapStateToProps = (state) => ({
  viewState: state.images.get('collections')
});
export class NewCollectionView extends React.Component {
  constructor() {
    super();
    this.clearForm = this.clearForm.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  clearForm() {
    this.props.setNewCollectionErrorFields([]);
    const fields = ['collectionName'];
    fields.map(field => {
      this.refs[field].refs['input'].value = '';
    });
  }

  handleSave() {
    let form = {
      collectionName: this.refs.collectionName.getValue()
    };
    const issues = this.validateForm(form);
    if (issues.length > 0) {
      this.props.setNewCollectionErrorFields(issues);
    } else {
      store.dispatch(appActions.setLoadingState(true, 'Loading collection'));
      this.props.saveCollection(form);
      this.clearForm();
    }
  }

  validateForm(form) {
    let issues = [];
    if (isBlank(form.collectionName)) {
      issues.push('collectionName');
    }
    return issues;
  }

  render() {
    return (
      <div className='container text-center'>
        <br/>
        <br/>
        <h3>New Collection</h3>
        <br/>
        <form className={classes.newCollectionForm}>
          <div className={classes.formDiv}>
            <Input
              ref='collectionName'
              type='text'
              label='Collection Name'
              placeholder='Enter Collection Name'
              className={classes.textField}
              bsStyle={this.props.viewState.get('newCollectionErrors').indexOf('collectionName') > -1 ? 'error' : undefined}
              />
            {
              this.props.viewState.get('newCollectionErrors').indexOf('collectionName') > -1
                ? <p className={classes.errorMsg}>This field is required.</p> : <span></span>
            }
            <div className={classes.formButtons}>
              <Button className={classes.saveCollectionButton} bsStyle={'success'} onClick={this.handleSave}>Save Collection</Button>
              <Button onClick={this.clearForm}>Clear Form</Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, imageActions)(NewCollectionView);
