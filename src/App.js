import React, { useState, useEffect, useMemo, useReducer } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Switch from "./Switch.js";
import Profile from "./profile";
import {
  BrowserRouter as Router,
  Switch as SwitchRouter,
  Link,
  Route,
  useRouteMatch,
} from "react-router-dom";

const theme = {
  dark: {
    box: {
      backgroundColor: `rgb(30, 35, 53)`,
    },

    container: {
      backgroundColor: `rgb(23, 25, 36)`,
      color: `white`,
    },
  },

  light: {
    box: {
      backgroundColor: `rgb(236, 227, 227)`,
    },
    container: {
      backgroundColor: `white`,
      color: `black`,
      boxShaddow: `0px 0px 8px rgba(0,0,0,.8)`,
    },
  },
};

function AppReducer(state, action) {
  switch (action.type) {
    case "loading": {
      return {
        ...state,
        status: {
          ...state.status,
          fetch: false,
          type: "loading",
        },
      };
    }
    case "error": {
      return {
        ...state,
        status: {
          message: action.payload.message,
          fetch: false,
          type: "error",
        },
      };
    }
    case "success": {
      return {
        data: action.payload.data,
        status: {
          ...state.status,
          fetch: false,
          type: "success",
        },
      };
    }
    case "refetch": {
      return {
        ...state,
        status: {
          ...state.status,
          fetch: true,
        },
      };
    }
    case "iddle": {
      return {
        ...state,
        status: {
          ...state.status,
          fetch: false,
          type: "iddle",
        },
      };
    }
    default:
      return state;
  }
}

function App() {
  const [mode, setMode] = useState(() => {
    const theme = localStorage.getItem("theme");
    return theme === "true" ? true : false;
  });
  const [data, dispatch] = useReducer(AppReducer, {
    status: {
      type: "iddle", // iddle, loading, error success,
      message: null,
      fetch: true,
    },
    data: null,
  });

  // Masukan kedalam local
  useEffect(() => {
    localStorage.setItem("theme", mode ? "true" : "false");
  }, [mode]);

  // requestData
  useEffect(() => {
    // let controller = new AbortController();
    async function fetchData() {
      try {
        dispatch({ type: "loading" });
        let data = await (
          await fetch(
            "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true",
            {
              method: "get",
              // signal: controller.signal
            }
          )
        ).json();

        dispatch({
          type: "success",
          payload: { data, message: "Berhasil Mengambil data" },
        });
      } catch (err) {
        dispatch({
          type: "error",
          payload: { message: err?.message || "ADA ERROR SAAT REQUEST" },
        });
        console.error(err);
      }
    }

    console.log(data.status, "STATUS");
    if (data.status.type !== "loading" && data.status.fetch) fetchData();
    // return () => {
    //   controller.abort();
    // }
  }, [data.status, dispatch]);

  return (
    <ThemeProvider theme={mode ? theme.light : theme.dark}>
      <GlobalStyle />
      <Router>
        <Container>
          <Header data={data.data} mode={mode} setMode={setMode}></Header>
          <SwitchRouter>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/" exact>
              <Main
                data={data.data}
                status={data.status}
                dispatch={dispatch}
              ></Main>
            </Route>
          </SwitchRouter>
          <Footer></Footer>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

// Component
const Header = React.memo(function Header({ data, mode, setMode }) {
  const match = useRouteMatch("/");
  const dataDetail = useMemo(
    () =>
      !data
        ? { positif: 0, sembuh: 0, meninggal: 0 }
        : data.reduce(
            (prev, current) => {
              return {
                positif: Number.isInteger(current.infected)
                  ? prev.positif + current.infected
                  : prev.positif,
                sembuh: Number.isInteger(current.recovered)
                  ? prev.sembuh + current.recovered
                  : prev.sembuh,
                meninggal: Number.isInteger(current.deceased)
                  ? prev.meninggal + current.deceased
                  : prev.meninggal,
              };
            },
            { positif: 0, sembuh: 0, meninggal: 0 }
          ),
    [data]
  );

  return (
    <HeaderContainer>
      <HeaderHeader>
        <h1>Pantau Corona</h1>
        <ToggleParent>
          <LinkProfile />
          {/* <Toggle>
            <span className="first">Indonesia</span>
            <Switch
              isOn={value}
              handleToggle={() => setValue(!value)}
              id="fromData"
            />
            <span className="second">Global</span>
          </Toggle> */}
          <Toggle>
            <span className="first">🌙</span>
            <Switch isOn={mode} handleToggle={() => setMode(!mode)} id="mode" />
            <span className="second">🌞</span>
          </Toggle>
        </ToggleParent>
      </HeaderHeader>
      {match && match?.isExact && (
        <HeaderMain>
          <Card>
            <span className="icon">😷</span>
            <div className="main-content">
              <div className="title">Kasus Positif</div>
              <div className="kasus">{formatPrice(dataDetail.positif)}</div>
            </div>
          </Card>

          <Card>
            <span className="icon">😊</span>
            <div className="main-content">
              <div className="title">Kasus Sembuh</div>
              <div className="kasus">{formatPrice(dataDetail.sembuh)}</div>
            </div>
          </Card>

          <Card>
            <span className="icon">💀</span>
            <div className="main-content">
              <div className="title">Kasus Kematian</div>
              <div className="kasus">{formatPrice(dataDetail.meninggal)}</div>
            </div>
          </Card>
        </HeaderMain>
      )}
      {/* <HeaderLastUpdate>
        Last Update{" "}
        
      </HeaderLastUpdate> */}
    </HeaderContainer>
  );
});

const Main = React.memo(function Main({ status, data, dispatch }) {
  switch (status.type) {
    case "loading": {
      return (
        <MainComponent>
          <MainComponentMain>
            <div className="loader"></div>
          </MainComponentMain>
        </MainComponent>
      );
    }
    case "error": {
      return (
        <MainComponent>
          <MainComponentMain>
            <MainComponentMainAnother>
              <h1>Terdapat Error saat melakukan data {":("}</h1>
              <p>
                {"Penyebab Error : "}
                {status.message}
              </p>
              <button onClick={() => dispatch({ type: "refetch" })}>
                Klik disini untuk Coba Lagi
              </button>
            </MainComponentMainAnother>
          </MainComponentMain>
        </MainComponent>
      );
    }
    case "success": {
      // Jika data kosong (belum melakukan request, karena nilai defaultnya adalah null) atau panjang data == 0
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return (
          <MainComponent>
            <MainComponentMain>
              <MainComponentMainAnother>
                <h1>
                  {!data
                    ? "Data Tidak ditemukan"
                    : Array.isArray(data) && data.length === 0
                    ? "Data Kosong"
                    : "Ga bisa nampilin data"}{" "}
                  {" :("}
                </h1>
              </MainComponentMainAnother>
            </MainComponentMain>
          </MainComponent>
        );
      }

      return (
        <MainComponent>
          <MainComponentMain>
            <MainHeader>
              <MainHeading>Nama</MainHeading>
              <MainHeading>Positif</MainHeading>
              <MainHeading>Sembuh</MainHeading>
              <MainHeading>Meninggal</MainHeading>
            </MainHeader>
            <MainMain>
              {data &&
                data.map((val, idx) => {
                  return (
                    <div key={`ITEM-${idx}-${idx + 10}`}>
                      <span>{val.country}</span>
                      <span>
                        {val.infected !== "NA" && val?.infected
                          ? formatPrice(val.infected)
                          : "-"}
                      </span>
                      <span>
                        {val.recovered !== "NA" && val?.recovered
                          ? formatPrice(val.recovered)
                          : "-"}
                      </span>
                      <span>
                        {val.deceased !== "NA" && val?.deceased
                          ? formatPrice(val.deceased)
                          : "-"}
                      </span>
                    </div>
                  );
                })}
            </MainMain>
          </MainComponentMain>
        </MainComponent>
      );
    }
    default: {
      return <></>;
    }
  }
});

function LinkProfile() {
  const match = useRouteMatch('/profile');
  return (
    <ProfileLink>
      <Link to={match ? "/" : "/profile"}>
        {match ? "Home" : "Profile" }
      </Link>
    </ProfileLink>
  );
}

const Footer = React.memo(function Footer() {
  return <FooterComponent>Made By ♥</FooterComponent>;
});

function formatPrice(value) {
  let val = Math.ceil(value).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Style Component
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.box.backgroundColor};
  };

  .loader {
    font-size: 10px;
    margin: 50px auto;
    text-indent: -9999em;
    width: 5em;
    height: 5em;
    border-radius: 50%;
    background: #764abc;
    background: -moz-linear-gradient(
      left,
      #764abc 10%,
      rgba(128, 0, 255, 0) 42%
    );
    background: -webkit-linear-gradient(
      left,
      #764abc 10%,
      rgba(128, 0, 255, 0) 42%
    );
    background: -o-linear-gradient(
      left,
      #764abc 10%,
      rgba(128, 0, 255, 0) 42%
    );
    background: -ms-linear-gradient(
      left,
      #764abc 10%,
      rgba(128, 0, 255, 0) 42%
    );
    background: linear-gradient(
      to right,
      #764abc 10%,
      rgba(128, 0, 255, 0) 42%
    );
    position: relative;
    -webkit-animation: load3 1.4s infinite linear;
    animation: load3 1.4s infinite linear;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  
  .loader:before {
    width: 50%;
    height: 50%;
    background: #764abc;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  
  .loader:after {
    background: ${({ theme }) => theme.box.backgroundColor};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const Box = styled.div`
  border: 1px solid black;
  border-radius: 0.8rem;
  background-color: ${({ theme }) => theme.box.backgroundColor};
`;

const Container = styled.div`
  width: 90%;
  margin: 0.8rem auto;
  border-radius: 0.8rem;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.container.backgroundColor};
  color: ${({ theme }) => theme.container.color};
  @media (max-width: 576px) {
    & {
      height: 100%;
      overflow: auto;
    }
  }
  box-shadow: ${({ theme }) => theme.container.boxShaddow};
`;

const HeaderContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

const HeaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 576px) {
    & {
      flex-wrap: wrap;
      justify-content: center;
    }
  } ;
`;

const HeaderMain = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.5rem;
  justify-content: center;

  @media (max-width: 992px) {
    & {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  @media (max-width: 768px) {
    & {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
`;

// const HeaderLastUpdate = styled(Box)`
//   padding: 0.5rem;
//   font-size: 1.3rem;
//   text-align: center;
// `;

const Card = styled(Box)`
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  justify-items: center;
  .icon {
    font-size: 3rem;
  }

  .main-content {
    margin-left: 0.5rem;
    font-size: 1.5rem;
  }

  .kasus {
    font-size: 2.5rem;
  }

  @media (max-width: 992px) {
    .icon {
      font-size: 2rem;
    }

    .main-content {
      margin-left: 0.5rem;
      font-size: 1.3rem;
    }

    .kasus {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    .icon {
      font-size: 1.5rem;
    }

    .main-content {
      margin-left: 0.5rem;
      font-size: 1rem;
    }

    .kasus {
      font-size: 1.5rem;
    }
  }
`;

const Toggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0.5rem;
  .first {
    margin-right: 0.5rem;
  }

  .second {
    margin-left: 0.5rem;
  }
`;

const ProfileLink = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  // margin-right: 20px;
  font-weight: bold;

  & a {
    color: ${({ theme }) => theme.container.color};
    font-weight: normal;
    font-size: 20px;
    cursor: pointer;
    text-decoration: underline;
  
    &:hover {
      text-decoration: none;
    }
  
  }
  @media screen and (min-width: 1280px) {
    & a{
      font-size: 24px;
    }
  }
`;

const ToggleParent = styled.div`
  display: flex;
  @media (max-width: 576px) {
    & {
      justify-content: center;
      width: 100%;
    }
  }
`;

const MainComponent = styled(Box)`
  overflow: auto;
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const MainComponentMainAnother = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;

  h1 {
    font-size: 16px;
  }

  p {
    font-family: "Patrick Hand", cursive;
    // font-size: 24px;
    font-size: 16px;
  }

  h1,
  p {
    margin: 0;
  }

  button {
    background-color: transparent;
    border: 0;
    appearance: none;
    color: ${({ theme }) => theme.container.color};
    // font-size: 24px;
    font-size: 16px;
    text-decoration: underline;
    cursor: pointer;
    font-family: "Patrick Hand", cursive;
  }

  & button:hover {
    text-decoration: none;
  }

  @media (min-width: 640px) {
    h1,
    button,
    p {
      font-size: 1.2em;
    }
  }

  @media (min-width: 768px) {
    h1 {
      font-size: 1.5em;
    }

    button,
    p {
      font-size: 24px;
    }
  }

  @media (min-width: 1024px) {
    h1 {
      font-size: 2em;
    }
  }
`;

const MainComponentMain = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  overflow: auto;

  & h1 {
    text-align: center;
  }
  

  @media (max-width: 576px) {
    & {
      width: 200%;
  };

`;

const MainHeading = styled.span`
  font-size: 2rem;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    & {
      font-size: 1.5rem;
    }
  }
`;

const MainHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  justify-items: center;
  align-items: center;
`;

const MainMain = styled.div`
  overflow: auto;
  gap: 0 0.5rem;
  width: 100%;
  div {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 100%;
    justify-items: center;
    align-items: center;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const FooterComponent = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;

  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.container.color};
  }
`;
