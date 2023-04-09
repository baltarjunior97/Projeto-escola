import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import PropsTypes from 'prop-types';
import Loading from '../../components/loading';
import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/axios';
import { Title, Form } from './styled';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match, history }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [foto, setFoto] = React.useState('');

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        setFoto(get(data, 'Fotos[0].url', ''));
        setIsLoading(false);
      } catch {
        toast.error('Erro ao obter imagem');
        setIsLoading(false);
        history.push('/');
      }
    };
    getData();
  }, [id, history]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const fotoURL = URL.createObjectURL(file);

    setFoto(fotoURL);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', file);

    try {
      setIsLoading(true);
      await axios.post(`/fotos/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Foto enviado com sucesso');

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const { status } = get(err, 'response', '');
      toast.error('Erro ao enviar foto');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Fotos</Title>
      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropsTypes.shape({}).isRequired,
  history: PropsTypes.shape([]).isRequired,
};
