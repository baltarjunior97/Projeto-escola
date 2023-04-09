import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/loading';

export default function Login(props) {
  const dispatch = useDispatch();

  const prevPath = get(props, 'location.state.prevPath', '/');

  const isLoading = useSelector((state) => state.auth.isLoading);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email invalido');
    }
    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('senha invalida');
    }

    if (formErrors) return;

    dispatch(actions.loginRequest({ email, password, prevPath }));
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
        />
        <button type="submit">Entrar</button>
      </Form>
    </Container>
  );
}
