import { Map } from 'immutable';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { getStore } from '../../main.js'

const agent = _agent_promise(_agent, _promise);

// ------------------------------------
// Constants
// ------------------------------------
const TOGGLE_ADD_PIC_MODAL = 'TOGGLE_ADD_PIC_MODAL';
const SET_UPLOAD_IMAGE_SRC = 'SET_UPLOAD_IMAGE_SRC';
const POST_IMAGE = 'POST_IMAGE';
const CANCEL_UPLOAD_IMAGE = 'CANCEL_UPLOAD_IMAGE';
const SAVE_IMAGE = 'SAVE_IMAGE';
const SAVE_MULTIPLE_IMAGES = 'SAVE_MULTIPLE IMAGES';

// ------------------------------------
// Actions
// ------------------------------------
export const toggleAddPicModal = () => ({type: TOGGLE_ADD_PIC_MODAL});

export const setUploadImageSrc = (src) => ({type: SET_UPLOAD_IMAGE_SRC, src: src});

export const postImage = (userId, imageUri) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/upload')
      .send(JSON.stringify({
        'userId': userId,
        'imageUri': imageUri
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function(res) {
        dispatch(setUploadImageSrc(res.text.split('"')[1]));
      }, function(err) {
        console.log(err);
      });
  };
};

export const cancelImage = (userId, imageAlias) => {
  return dispatch => {
    dispatch(setUploadImageSrc(undefined));
    return agent
      .post('http://localhost:7000/upload/discard')
      .send(JSON.stringify({
        'userId': userId,
        'imageAlias': imageAlias
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end();
  };
};

export const saveMultipleImages = (userId, images) => ({type: SAVE_MULTIPLE_IMAGES, images: images});

export const saveImage = (userId, imageAlias) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/save/image')
      .send(JSON.stringify({
        'userId': userId,
        'imageAlias': imageAlias
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function(res) {
        return dispatch(saveMultipleImages(userId, res.text.split('"')[1]));
      }, function(err) {
        console.log(err);
      });
  };
};

export const loadPassImages = (userId) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/images')
      .send(JSON.stringify({
        'userId': userId
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end(function(err, res) {
        if (err) {
          console.log(err)
        } else {
          let imageArray = [];
          let images = JSON.parse(res.text);
          if (images != undefined && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
              imageArray.push(images[i].Alias);
            }
          }
          dispatch(saveMultipleImages(userId, imageArray))
        }
      });
  }
};

export const actions = {
  toggleAddPicModal,
  setUploadImageSrc,
  postImage,
  saveImage,
  saveMultipleImages,
  cancelImage,
  loadPassImages
};

// ------------------------------------
// State
// ------------------------------------
const subjectUploadViewState = Map({
  'showAddPicModal': false,
  'uploadImageSrc': undefined,
  'userPassImages': []
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function subjectUploadViewReducer(state = subjectUploadViewState, action = null) {
  switch (action.type) {
    case TOGGLE_ADD_PIC_MODAL: {
      const toggleState = state.get('showAddPicModal');
      return state.set('showAddPicModal', !toggleState);
    }
    case SET_UPLOAD_IMAGE_SRC: {
      return state.set('uploadImageSrc', action.src);
    }
    case CANCEL_UPLOAD_IMAGE: {
      return state;
    }
    case SAVE_IMAGE: {
      return state.set;
    }
    case SAVE_MULTIPLE_IMAGES: {
      const currentImages = state.get('userPassImages');
      return state.set('userPassImages', currentImages.concat(action.images))
    }
    case POST_IMAGE: {
      return state;
    }
    default: {
      return state;
    }
  }
}
