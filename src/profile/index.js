import {
  Link,
  useRouteMatch,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import styled from "styled-components";
import Rhafael from "./rhafael";
import Budi from "./budi";
import Egi from "./egi";

export default function Elbi() {
  const match = useRouteMatch();

  return (
    <BrowserRouter>
      <Container>
        <ContainerContent>
          <h1>Profile</h1>
          <Switch>
            <Route path={match.path} exact>
              <p>
                Ini Adalah halaman yang menampilkan data dari orang-orang dari
                kelompok mickymouse. <b>Berikut</b> Merupakan List member
                mickymouse :
              </p>
            </Route>
            <Route path={`${match.path}/rhafael`}>
              <Rhafael />
            </Route>
            <Route path={`${match.path}/budi`}>
              <Budi />
            </Route>
            <Route path={`${match.path}/egi`}>
              <Egi />
            </Route>
          </Switch>
        </ContainerContent>
        <ContainerLink>
          
          <Link to={`${match.url}/rhafael`}>Rhafael Bijaksana</Link>
          {","}
          <Link to={`${match.url}/egi`}>Egi Permana</Link>
          {","}
          <Link to={`${match.url}`}>Kembali Ke Kumpulan Profile</Link>
        </ContainerLink>
        <div></div>
      </Container>
    </BrowserRouter>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 50px;
`;

const ContainerContent = styled.div`
  h1 {
    font-size: 32px;
  }

  p {
    font-size: 24px;
  }

  h1,
  p {
    margin: 0;
  }
`;

const ContainerLink = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;

  a {
    color: ${({ theme }) => theme.container.color};
    font-size: 20px;
  }

  a:hover {
    text-decoration: none;
  }
`;
