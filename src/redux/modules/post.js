import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { apis } from "../../shared/Api";
import "moment";

import { ActionCreators as imageActions } from "./image";

import axios from "axios";

// ---- actions type ----
const GET_POST = "GET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";

// ---- action creators ----
const getPost = createAction(GET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));

// ---- initialState ----
const initialState = {
  list: [],
};

const initialPost = {
  id: 1,
  location: "",
  image: null,
  content: "",
  nickname: "",
};

// ---- middleware actions ----
//-- getPostDB(DB 데이터 가져오기) --
export const getPostDB =
  () =>
  async (dispatch, getState, { history }) => {
    try {
      console.log("목록 불러오기 성공");
      const postlist = await apis.boards();
      dispatch(getPost(postlist.data));
    } catch (err) {
      console.log(`boards 조회 오류 발생!${err}`);
    }
  };

//-- deletePostDB --
export const deletePostDB =
  (post_id) =>
  async (dispatch, getState, { history }) => {
    try {
      const accessToken = document.cookie.split(";")[0].split("=")[1];
      axios
        .delete(`http://52.78.31.61/api/board/detail/${post_id}`, {
          headers: {
            "X-AUTH-TOKEN": accessToken,
          },
        })
        .then((response) => {
          window.alert("게시물 삭제 완료");
          dispatch(deletePost(post_id));
          history.replace("/");
        })
        .catch((err) => {
          window.alert("게시물 삭제 실패");
          console.log(err);
        });
    } catch (err) {
      console.error("게시물 삭제 문제 발생", err);
    }
  };

//-- addPostDB --
export const addPostDB =
  (_location, _content, formData) =>
  async (dispatch, getState, { history }) => {
    try {
      const user_id = getState().user.nickname;
      const image_url = getState().image.preview;

      const accessToken = document.cookie.split("=")[1];

      const _post = {
        ...initialPost,
        content: _content,
        location: _location,
        nickname: user_id,
        image: image_url,
      };

      axios({
        method: "post",
        url: "http://52.78.31.61/api/board",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-AUTH-TOKEN": `${accessToken}`,
        },
      })
        .then((response) => {
          console.log(response.data);
          dispatch(addPost(response.data));
          window.alert("게시물 업로드 완료");
          // dispatch(getPost());
          history.replace("/");
          dispatch(imageActions.setPreview(null));
        })
        .catch((err) => {
          window.alert("게시물 업로드 실패");
          console.log(err);
        });
    } catch (err) {
      console.error("게시물 업로드 문제 발생", err);
    }
  };

//-- editPostDB --
export const editPostDB =
  (post_id = null, content = {}, location, formData) =>
  async (dispatch, getState, { history }) => {
    try {
      if (!post_id) {
        console.log("게시물 정보가 없어요!");
        return;
      }
      const image_url = getState().image.preview;

      const accessToken = document.cookie.split("=")[1];

      const _post = {
        ...initialPost,
        content: content,
        location: location,
        image: image_url,
      };

      axios({
        method: "put",
        url: `http://52.78.31.61/api/board/detail/${post_id}`,
        data: formData,
        _post,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-AUTH-TOKEN": `${accessToken}`,
        },
      })
        .then((response) => {
          window.alert("게시물 수정 완료");

          dispatch(
            editPost(post_id, { ...content, ...location, image: image_url })
          );
          dispatch(imageActions.setPreview(null));
          history.replace("/");
        })
        .catch((err) => {
          window.alert("게시물 수정 실패");
          console.log(err);
        });
    } catch (err) {
      window.alert("");
      console.log(err);
    }
  };

//---- reducer ----
export default handleActions(
  {
    [GET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex(
          (p) => p.id === Number(action.payload.post_id)
        );
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),

    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        let deleted_list = draft.list.filter(
          (p) => p.id !== Number(action.payload.post_id)
        );

        draft.list = deleted_list;
      }),
  },
  initialState
);

const actionCreators = {
  getPost,
  getPostDB,
  // getOnePostDB,
  addPostDB,
  editPostDB,
  deletePostDB,
  deletePost,
};

export { actionCreators };
