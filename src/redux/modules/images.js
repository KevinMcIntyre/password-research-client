import { Map } from 'immutable';
import { setLoadingState } from './app';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { push } from 'react-router-redux';

const agent = _agent_promise(_agent, _promise);

// ------------------------------------
// Constants
// ------------------------------------
const SET_UPLOAD_IMAGES = 'SET_UPLOAD_IMAGES';
const SPLICE_UPLOAD_IMAGE = 'SPLICE_UPLOAD_IMAGE';
const SAVE_MULTIPLE_IMAGES = 'SAVE_MULTIPLE IMAGES';
const SET_COLLECTIONS = 'SET_COLLECTIONS';
const SET_COLLECTION = 'SET_COLLECTION';
const SET_NEW_COLLECTION_ERRORS = 'SET_NEW_COLLECTION_ERRORS';
const ADD_COLLECTION = 'ADD_COLLECTION';
const TOGGLE_LOADING_STATE = 'TOGGLE_LOADING_STATE';
const CLEAR_SUBJECT = 'CLEAR_SUBJECT';

// ------------------------------------
// Actions
// ------------------------------------
export const setSubjectLoadingState = (loading, text) => ({type: TOGGLE_LOADING_STATE, loading: loading, text: text});

export const clearSubject = () => ({type: CLEAR_SUBJECT});

export const addCollection = (collection) => ({type: ADD_COLLECTION, collection: collection});

export const saveCollection = (form) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/collections/new')
      .send(JSON.stringify({
        'collectionLabel': form.collectionName
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(addCollection({
            value: response.id,
            label: form.collectionName
          }));
          dispatch(setCollection({
            id: response.id,
            label: form.collectionName
          }));
          dispatch(push('/collections/' + response.id));
          setTimeout(function() {
            dispatch(setLoadingState(false));
          }, 1000);
        }
      });
  };
};

export const setNewCollectionErrorFields = (issues) => ({type: SET_NEW_COLLECTION_ERRORS, newCollectionErrors: issues});

export const setCollections = (collections) => ({type: SET_COLLECTIONS, collections: collections});

export const setCollection = (collection) => ({type: SET_COLLECTION, collection: collection});

export const loadCollections = (collectionId) => {
  return dispatch => {
    return agent
      .get('http://localhost:7000/collections/list')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(setCollections(response));
          if (collectionId) {
            response.map(collection => {
              if (collection.Id === collectionId) {
                dispatch(setCollection({
                  id: collection.Id,
                  label: collection.Label
                }));
                dispatch(loadImages(undefined, collection.Id));
              }
            });
          } else {
            setTimeout(function() {
              dispatch(setLoadingState(false));
            }, 1000);
          }
        }
      });
  };
};

export const setUploadImages = (subjectId, collectionId, aliases) => ({type: SET_UPLOAD_IMAGES, subjectId: subjectId, collectionId: collectionId, aliases: aliases});

export const postImage = (subjectId, collectionId, files) => {
  return dispatch => {
    let req = agent.post('http://localhost:7000/upload')
      .field('subjectId', subjectId)
      .field('collectionId', collectionId);
    files.forEach((file) => {
      req.attach(file.name, file);
    });
    return req.set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    })
      .end()
      .then(function(res) {
        let json = JSON.parse(res.text);
        dispatch(setUploadImages(json.SubjectId, json.CollectionId, json.Aliases));
        dispatch(setSubjectLoadingState(false));
        dispatch(setLoadingState(false));
      }, function(err) {
        console.log(err);
      });
  };
};

const spliceUploadImage = (subjectId, collectionId, alias) => ({type: SPLICE_UPLOAD_IMAGE, subjectId: subjectId, collectionId: collectionId, alias: alias});

export const discardImage = (subjectId, collectionId, alias) => {
  return dispatch => {
    dispatch(spliceUploadImage(subjectId, collectionId, alias));
    return agent
      .post('http://localhost:7000/upload/discard')
      .send(JSON.stringify({
        'subjectId': parseInt(subjectId, 10),
        'collectionId': parseInt(collectionId, 10),
        'imageAlias': alias
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end();
  };
};

export const saveMultipleImages = (subjectId, collectionId, images) => ({type: SAVE_MULTIPLE_IMAGES, subjectId: subjectId, collectionId: collectionId, images: images});

export const saveImage = (subjectId, collectionId, imageAlias) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/save/image')
      .send(JSON.stringify({
        'subjectId': parseInt(subjectId, 10),
        'collectionId': parseInt(collectionId, 10),
        'imageAlias': imageAlias
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function(res) {
        return dispatch(saveMultipleImages(subjectId, collectionId, res.text.split('"')[1]));
      }, function(err) {
        console.log(err);
      }).then(function(res) {
        return dispatch(discardImage(subjectId, collectionId, imageAlias));
      });
  };
};

export const loadImages = (subjectId, collectionId) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/images')
      .send(JSON.stringify({
        'subjectId': subjectId,
        'collectionId': collectionId
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end(function(err, res) {
        if (err) {
          console.log(err);
        } else {
          let imageArray = [];
          let images = JSON.parse(res.text);
          if (images != undefined && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
              imageArray.push(images[i].Alias);
            }
          }
          dispatch(saveMultipleImages(subjectId, collectionId, imageArray));
          setTimeout(function() {
            dispatch(setLoadingState(false));
            dispatch(setSubjectLoadingState(false));
          }, 1000);
        }
      });
  };
};

export const actions = {
  setUploadImages,
  postImage,
  saveImage,
  saveMultipleImages,
  discardImage,
  loadImages,
  loadCollections,
  setCollection,
  setNewCollectionErrorFields,
  saveCollection,
  setSubjectLoadingState,
  clearSubject
};

// ------------------------------------
// State
// ------------------------------------
const imagesState = Map({
  collections: Map({
    'collections': [],
    'currentCollection': undefined,
    'uploadImages': [],
    'collectionImages': [],
    'update': 0,
    'newCollectionErrors': []
  }),
  subject: Map({
    'uploadImages': [],
    'subjectImages': [],
    'update': 0,
    'loading': false,
    'loadingText': 'Processing'
  })
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function imageReducer(state = imagesState, action = null) {
  const key = action.subjectId ? 'subject' : 'collections';
  const imagesKey = action.subjectId ? 'subjectImages' : 'collectionImages';
  let map = state.get(key);
  switch (action.type) {
    case CLEAR_SUBJECT: {
      return state.set('subject', Map({
        'uploadImages': [],
        'subjectImages': [],
        'update': 0,
        'loading': false,
        'loadingText': 'Processing'
      }));
    }
    case TOGGLE_LOADING_STATE: {
      if (action.text !== undefined) {
        state = state.set('loadingText', action.text);
      }
      return state.set('loading', action.loading);
    }
    case SET_COLLECTION: {
      map = map.set('currentCollection', action.collection).set(imagesKey, []);
      return state.set(key, map);
    }
    case SET_COLLECTIONS: {
      let collectionList = [];
      if (action.collections) {
        action.collections.map((collection) => {
          collectionList.push({value: collection.Id, label: collection.Label});
        });
      }
      map = map.set('collections', collectionList);
      return state.set(key, map);
    }
    case SET_UPLOAD_IMAGES: {
      map = map.set('uploadImages', action.aliases);
      return state.set(key, map);
    }
    case SPLICE_UPLOAD_IMAGE: {
      let aliases = map.get('uploadImages');
      const index = aliases.indexOf(action.alias);
      if (index > -1) {
        aliases.splice(index, 1);
      }
      map = map.set('uploadImages', aliases).set('update', state.get('update') + 1);
      return state.set(key, map);
    }
    case SAVE_MULTIPLE_IMAGES: {
      const currentImages = map.get(imagesKey);
      map = map.set(imagesKey, currentImages.concat(action.images));
      return state.set(key, map);
    }
    case SET_NEW_COLLECTION_ERRORS: {
      map = map.set('newCollectionErrors', action.newCollectionErrors);
      return state.set(key, map);
    }
    case ADD_COLLECTION: {
      let collectionList = map.get('collections');
      collectionList.push(action.collection);
      collectionList.sort((a, b) => {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1;
        }
        if (a.label.toLowerCase() > b.label.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      map = map.set('collections', collectionList);
      return state.set(key, map);
    }
    default: {
      return state;
    }
  }
}
