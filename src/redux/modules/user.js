import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { deleteCookie, setCookie } from "../../shared/Cookie";
import { apis } from "../../shared/Api";
import axios from "axios";

// ---- action ----
const LOGIN = "user/LOGIN";
const LOGOUT = "user/LOGOUT";
const SIGNUPID = "user/SIGNUPID";

// ---- action creator ----
const setLogin = createAction(LOGIN, (user) => ({ user }));
const logout = createAction(LOGOUT, (user) => ({ user }));
const signupId = createAction(SIGNUPID, (id) => ({ id }));

// ---- initialState ----
const initialState = {
  nickname: "suin",
  is_login: false, //로그인 확인
  response: null, //닉네임 중복 확인
};

//---- 회원가입 DB ----
export const signUpDB =
  (id, pwd, email) =>
  async (dispatch, getState, { history }) => {
    try {
      const response = await apis.signup(id, pwd, email);
      window.alert("회원가입이 완료되었습니다. 로그인 해주세요");
      history.replace("/user/login");
    } catch (err) {
      console.log(`오류 발생!${err}`);
    }
  };

//---- 회원가입 아이디 체크 DB ----
export const signUpIdCheckDB =
  (id) =>
  async (dispatch, getState, { history }) => {
    try {
      const response = await apis.signupId(id);
      dispatch(signupId(response.data));
    } catch (err) {
      console.log(`조회 오류 발생!${err}`);
    }
  };
//---- 로그인 DB ----
export const loginDB =
  (id, pwd) =>
  async (dispatch, getState, { history }) => {
    try {
      const response = await apis.login(id, pwd);
      let username = response.data[0].username;
      setCookie("token", response.data[1].token, 7);
      localStorage.setItem("username", response.data[0].username);
      dispatch(setLogin(username));
      window.alert(`${username}님 환영합니다`);

      history.replace("/");
    } catch (err) {
      window.alert("없는 회원정보 입니다! 회원가입을 해주세요!");
      console.log(`오류 발생!${err}`);
    }
  };

// ---- 로그아웃 DB ----
const logoutDB = () => {
  return function (dispatch, getState, { history }) {
    dispatch(logout());
    history.replace("/");
    localStorage.removeItem("username");
  };
};

//---- 로그인 체크 DB ----
const loginCheckDB = () => {
  return function (dispatch, getState, { history }) {
    const userId = localStorage.getItem("username");
    const tokenCheck = document.cookie;
    if (tokenCheck) {
      dispatch(setLogin({ id: userId }));
    } else {
      dispatch(logout());
    }
  };
};

//---- 카카오 로그인 DB ----
const kakaoLogin = (code) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: `http://52.78.31.61/oauth/callback/kakao?code=${code}`,
    })
      .then((response) => {
        const ACCESS_TOKEN = response.data.token;
        localStorage.setItem("username", ACCESS_TOKEN);
        history.replace("/");
        dispatch(setLogin());
      })
      .catch((err) => {
        console.log("소셜로그인 에러", err);
        window.alert("로그인에 실패하였습니다.");
        history.replace("/login");
      });
  };
};

// ---- reducer ----
export default handleActions(
  {
    [LOGIN]: (state, action) =>
      produce(state, (draft) => {
        draft.nickname = action.payload.user;
        draft.is_login = true;
      }),
    [LOGOUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("token");
        draft.nickname = null;
        draft.is_login = false;
      }),
    [SIGNUPID]: (state, action) =>
      produce(state, (draft) => {
        draft.response = action.payload.id;
      }),
  },
  initialState
);

const userCreators = {
  loginDB,
  signUpDB,
  logoutDB,
  signUpIdCheckDB,
  loginCheckDB,
  kakaoLogin,
};

export { userCreators };
