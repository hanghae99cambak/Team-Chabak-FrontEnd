import React from "react";
import styled from "styled-components";
import { userCreators as userActions } from "../redux/modules/user";
import { Text, Input, Grid, Button } from "../elements";

// redux
import { useDispatch, useSelector } from "react-redux";

const Signup = (props) => {
  const dispatch = useDispatch();

  const isIdResponse = useSelector((store) => store.user.response);

  //-- 아아디, 비밀번호, 비밀번호확인 , 이메일  --
  const [id, setId] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [pwd_check, setPwdCheck] = React.useState("");
  const [email, setEmail] = React.useState("");

  //-- 오류메시지 상태저장--
  const [idMessage, setIdMessage] = React.useState("");
  const [pwdMessage, setPwdMessage] = React.useState("");
  const [pwdCheckMessage, setPwdCheckMessage] = React.useState("");
  const [emailMessage, setEmailMessage] = React.useState("");

  //-- 유효성 검사 --
  const [isId, setIsId] = React.useState(false);
  const [isPassword, setIsPassword] = React.useState(false);
  const [isPwdCheck, setIsPwdCheck] = React.useState(false);
  const [isEmail, setIsEmail] = React.useState(false);

  //---- 아이디 유효성 검사  ----
  const idCheck = (e) => {
    const idCurrent = e.target.value;
    setId(idCurrent);
    if (id.length < 3 || id.length > 10) {
      setIdMessage("3글자 이상 10글자 미만으로 입력해주세요.");
    } else {
      setIdMessage("중복확인이 필요합니다.:)");

    }
  };
  //---- 아이디 중복  버튼 클릭시   ----
  const isIdCheck = () => {
    if (id.length < 3 || id.length > 10) {
      setIdMessage("3글자 이상 10글자 미만으로 입력해주세요.");
      return;
    } else {
      setIdMessage("중복확인이 필요합니다.:)");
      dispatch(userActions.signUpIdCheckDB(id));
      // setIsId(true);
    }
    if (isIdResponse) {
      setIdMessage("이미 있는 아이디 입니다.");
      setIsId(false);
    } else {
      setIdMessage("사용할 수 있는 아이디 입니다.");
      setIsId(true);
    }
  };
  //---- 비밀번호 유효성 검사  ----
  const onChangePassword = (e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{3,10}$/;
    const passwordCurrent = e.target.value;
    setPwd(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setPwdMessage(
        "숫자+영문자 조합으로 3자리 이상 10자리 이하로 입력해주세요!"
      );
      setIsPassword(false);
    } else {
      setPwdMessage("안전한 비밀번호에요 : )");
      setIsPassword(true);
    }
  };
  //---- 비밀번호 중복 확인  ----
  const onChangePasswordCheck = (e) => {
    const pwdCurrent = e.target.value;
    setPwdCheck(pwdCurrent);
    if (pwd === pwdCurrent) {
      setPwdCheckMessage("비밀번호를 똑같이 입력했어요 : )");
      setIsPwdCheck(true);
    } else {
      setPwdCheckMessage("비밀번호가 틀려요. 다시 확인해주세요 ㅜ ㅜ");
      setIsPwdCheck(false);
    }
  };
  //---- 이메일 유효성 검사  ----
  const onChangeEmail = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegex.test(emailCurrent)) {
      setEmailMessage("이메일 형식이 틀렸어요! 다시 확인해주세요 ㅜ ㅜ");
      setIsEmail(false);
    } else {
      setEmailMessage("올바른 이메일 형식이에요 : )");
      setIsEmail(true);
    }
  };
  // ---- 회원가입 버튼 클릭 ----
  const signUpClick = () => {
    if (!isId || !isPassword || !isPwdCheck || !isEmail) {
      window.alert("아이디, 패스워드, 이메일을 정확하게  입력해주세요");
      return;
    }
    dispatch(userActions.signUpDB(id, pwd, email));
  };
  return (
    <div>
      <Grid>
        <Text bold size="40px" color="333" center>
          회원가입
        </Text>
        {/* -- 아이디 --  */}
        <Grid>
          <Grid is_flex>
            <Input
              bginput
              label="아이디"
              placeholder="3~10자로 입력해주세요."
              _onChange={idCheck}
            ></Input>
            <Button
              text="중복확인"
              _onClick={isIdCheck}
              width="30%"
              margin="11px 0 0 10px"
              radius="10px"
              opacity="0.8"
            ></Button>
          </Grid>
          {id.length > 0 && (
            <Span className={`message ${isId ? "success" : "error"}`}>
              {idMessage}
            </Span>
          )}
        </Grid>
        {/* -- 비밀번호 --  */}
        <Grid>
          <Input
            bginput
            type="password"
            label="비밀번호"
            placeholder="8~16자 영문 대 소문자, 숫자"
            _onChange={onChangePassword}
          ></Input>

          {pwd.length > 0 && (
            <Span className={`message ${isPassword ? "success" : "error"}`}>
              {pwdMessage}
            </Span>
          )}
        </Grid>
        {/* -- 비밀번호 확인 -- */}
        <Grid>
          <Input
            bginput
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 한번 더 입력해주세요"
            _onChange={onChangePasswordCheck}
          ></Input>
          {pwd_check.length > 0 && (
            <Span className={`message ${isPwdCheck ? "success" : "error"}`}>
              {pwdCheckMessage}
            </Span>
          )}
        </Grid>
        {/* -- 이메일 -- */}
        <Grid>
          <Input
            bginput
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            _onChange={onChangeEmail}
          ></Input>
          {email.length > 0 && (
            <Span className={`message ${isEmail ? "success" : "error"}`}>
              {emailMessage}
            </Span>
          )}
        </Grid>

        <Button
          text="회원가입"
          _onClick={signUpClick}
          radius="10px"
          margin="20px 0 0 0"
        ></Button>
      </Grid>
    </div>
  );
};
const Span = styled.span`
  margin-bottom: 12px;
  display: flex;
  font-size: 14px;
  left: 0;
  &.success {
    color: #437244;
  }
  &.error {
    color: #ff2727;
  }
`;

export default Signup;
