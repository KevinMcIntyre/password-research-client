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
const SET_UPLOAD_IMAGES = 'SET_UPLOAD_IMAGES';
const POST_IMAGE = 'POST_IMAGE';
const NEW_POST_IMAGE = 'NEW_POST_IMAGE';
const DISCARD_UPLOAD_IMAGE = 'DISCARD_UPLOAD_IMAGE';
const SPLICE_UPLOAD_IMAGE = 'SPLICE_UPLOAD_IMAGE';
const SAVE_IMAGE = 'SAVE_IMAGE';
const SAVE_MULTIPLE_IMAGES = 'SAVE_MULTIPLE IMAGES';

// ------------------------------------
// Actions
// ------------------------------------
export const toggleAddPicModal = () => ({type: TOGGLE_ADD_PIC_MODAL});

export const setUploadImages = (userId, aliases) => ({type: SET_UPLOAD_IMAGES, userId: userId, aliases: aliases});

export const newPostImage = (userId, files) => {
  return dispatch => {
    let req = agent.post('http://localhost:7000/upload').field('userId', userId);
    files.forEach((file)=> {
      req.attach(file.name, file);
    });
    return req.set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function(res) {
        let resJson = JSON.parse(res.text);
        dispatch(setUploadImages(resJson.UserId, resJson.Aliases));
      }, function(err) {
        console.log(err);
      });
  };
};

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
        dispatch(setUploadImages(res.text.split('"')[1]));
      }, function(err) {
        console.log(err);
      });
  };
};

const spliceUploadImage = (userId, alias) => ({type: SPLICE_UPLOAD_IMAGE, userId: userId, alias: alias});


export const discardImage = (userId, alias) => {
  return dispatch => {
    dispatch(spliceUploadImage(userId, alias));
    return agent
      .post('http://localhost:7000/upload/discard')
      .send(JSON.stringify({
        'userId': userId,
        'imageAlias': alias
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
  setUploadImages,
  postImage,
  newPostImage,
  saveImage,
  saveMultipleImages,
  discardImage,
  loadPassImages
};

// ------------------------------------
// State
// ------------------------------------
const subjectUploadViewState = Map({
  'showAddPicModal': false,
  'uploadImages': Map({}),
  'userPassImages': [],
  'update': 0
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
    case SET_UPLOAD_IMAGES: {
      const uploadMap = state.get('uploadImages');
      return state.set('uploadImages', uploadMap.set(action.userId, action.aliases));
    }
    case DISCARD_UPLOAD_IMAGE: {
      return state;
    }
    case SPLICE_UPLOAD_IMAGE: {
      const uploadMap = state.get('uploadImages');
      let aliases = uploadMap.get(action.userId);
      const index = aliases.indexOf(action.alias);
      if (index > -1) {
        aliases.splice(index, 1);
      }
      return state
        .set('uploadImages', uploadMap.set(action.userId, aliases))
        .set('update', state.get('update') + 1);
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
    case NEW_POST_IMAGE: {
      return state;
    }
    default: {
      return state;
    }
  }
}
