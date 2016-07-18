import React from 'react';
import PassImage from '../../components/PassImage/PassImage';
import { Modal, Button } from 'react-bootstrap';

export default class UserImageModal extends React.Component {
  constructor() {
    super();
  }

  render() {
    if (this.props.subjectImages) {
      return (
        <Modal show={this.props.selectingImageId >= 0}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Pass Images
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Please select one of the following pass-images:</h4>
            <br/>
            <div>
              {
                this.props.subjectImages.map(function(subjectImageAlias, index) {
                  return (<PassImage
                    key={index}
                    img={"http://localhost:7000/image/" + subjectImageAlias}
                    isTesting={true}
                    alias={subjectImageAlias}
                    onImageClick={this.props.selectImage.bind(null, this.props.selectingImageId, subjectImageAlias)}
                  />)
                }.bind(this))
              }
            </div>
            <br/>
            <div>
              <Button bsStyle="primary" onClick={this.props.closeModal.bind(null, undefined)}>Close</Button>
            </div>
          </Modal.Body>
        </Modal>
      );
    } else {
      return (
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Pass Images
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>This user has no pass-images set.</h4>
          </Modal.Body>
        </Modal>
      );
    }

  }
}
