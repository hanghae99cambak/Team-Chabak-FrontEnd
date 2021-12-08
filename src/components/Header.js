import React from "react";
import { Button, Text, Grid } from "../elements";

import { history } from "../redux/configureStore";

import { useSelector, useDispatch } from "react-redux";
import { userCreators as userActions } from "../redux/modules/user";

const Header = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const is_token = document.cookie;

  if (is_login) {
    return (
      <React.Fragment>
        <div
          style={{
            width: "100%",
            height: "90px",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "1",
            background: "aliceblue",
          }}
        >
          <Grid is_flex margin=" 0px auto">
            <Grid>
              <Text
                is_text
                __onClick={() => {
                  history.push("/");
                }}
              ></Text>
            </Grid>
            <Grid is_flex>
              <Button
                text="게시물 등록"
                _onClick={() => {
                  history.push("/write");
                }}
              ></Button>
              <Button
                text="로그아웃"
                _onClick={() => {
                  dispatch(userActions.logOutDB());
                }}
              ></Button>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          height: "90px",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "1",
          background: "aliceblue",
        }}
      >
        <Grid is_flex margin=" 0px auto">
          <Grid>
            <Text
              is_text
              __onClick={() => {
                history.push("/");
              }}
            ></Text>
          </Grid>
          <Grid is_flex margin=" 0px auto">
            <Button
              text="로그인"
              _onClick={() => {
                history.push("/login");
              }}
            ></Button>
            <Button
              text="회원가입"
              _onClick={() => {
                history.push("signup");
              }}
            ></Button>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};
Header.defaultProps = {};

export default Header;
