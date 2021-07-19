import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Switch from "./Switch.js";
import country from './listCountry.js';

function App() {
  const [mode, setMode] = useState(false);
  return (
    <Container>
      <Header mode={mode} setMode={setMode}></Header>
      <Main></Main>
      <Footer></Footer>
    </Container>
  );
}

export default App;

// Component
function Header({mode, setMode}) {
  const [value, setValue] = useState(false);
  const [results, setResult] = useState({});
  const lastUpdate = results.lastUpdate ? new Date(results.lastUpdate) : null;

  useEffect(() => {
    async function fetchData() {
      try {
        let url = value
          ? "https://covid19.mathdro.id/api/"
          : "https://covid19.mathdro.id/api/countries/indonesia";
        let data = await (await fetch(url, { method: "get" })).json();
        setResult(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [value]);

  return (
    <HeaderContainer>
      <HeaderHeader>
        <h1>Pantau Corona</h1>
        <ToggleParent>
          <Toggle>
            <span className="first">Indonesia</span>
            <Switch
              isOn={value}
              handleToggle={() => setValue(!value)}
              id="fromData"
            />
            <span className="second">Global</span>
          </Toggle>
          <Toggle>
            <span className="first">🌙</span>
            <Switch isOn={mode} handleToggle={() => setMode(!mode)} id="mode" />
            <span className="second">🌞</span>
          </Toggle>
        </ToggleParent>
      </HeaderHeader>
      <HeaderMain>
        <Card>
          <span className="icon">😷</span>
          <div className="main-content">
            <div className="title">Kasus Positif</div>
            <div className="kasus">
              {results?.confirmed?.value
                ? results?.confirmed?.value?.toLocaleString()
                : "-"}
            </div>
          </div>
        </Card>

        <Card>
          <span className="icon">😊</span>
          <div className="main-content">
            <div className="title">Kasus Sembuh</div>
            <div className="kasus">
              {results?.recovered?.value
                ? results?.recovered?.value?.toLocaleString()
                : "-"}
            </div>
          </div>
        </Card>

        <Card>
          <span className="icon">💀</span>
          <div className="main-content">
            <div className="title">Kasus Kematian</div>
            <div className="kasus">
              {results?.deaths?.value
                ? results?.deaths?.value?.toLocaleString()
                : "-"}
            </div>
          </div>
        </Card>
      </HeaderMain>
      <HeaderLastUpdate>
        Last Update{" "}
        {lastUpdate &&
          `${lastUpdate.getHours()}:${lastUpdate.getMinutes()}:${lastUpdate.getSeconds()} ${lastUpdate.getDate()}-${
            lastUpdate.getMonth() + 1
          }-${lastUpdate.getFullYear()}`}
      </HeaderLastUpdate>
    </HeaderContainer>
  );
}

function Main(props) {
  const [results, setResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {


    // Set Loading State
    setLoading(true);

    // Check Data dilocal
    const dataLocal = localStorage.getItem('country');


    // Check APakah sebelumnya datanya kita cadangkan
    if(dataLocal) {
      setResults(JSON.parse(dataLocal));
      setLoading(false);
    } else {
      const countryPromises = country.countries.map((el) => fetch(`https://covid19.mathdro.id/api/countries/${el.name}`));
      Promise.all(countryPromises).then(result => {
        const resultsJson = result.map(value => value.json());
        Promise.all(resultsJson).then(value => {
          setResults(value);
          setLoading(false);
          localStorage.setItem('country', JSON.stringify(value));
  
        }).catch(err => console.error("Error Pas Json"))
      }).catch(err => console.error("Error bro"));
    }
  }, [])

  
  
  return (
    <MainComponent>
      {
        loading ? <div className="loader"></div> : (


          // Awal

          <MainComponentMain>
            <MainHeader>
              <MainHeading>Nama</MainHeading>
              <MainHeading>Positif</MainHeading>
              <MainHeading>Sembuh</MainHeading>
              <MainHeading>Meninggal</MainHeading>
            </MainHeader>
            <MainMain>
              {
                results && results.map((val, idx) => {
                  // console.log(val, country.countries[idx]);
                  return (
                    <div>
                      <span>{country.countries[idx].name}</span>
                      <span>{val.confirmed.value.toLocaleString()}</span>
                      <span>{val.recovered.value.toLocaleString()}</span>
                      <span>{val.deaths.value.toLocaleString()}</span>
                    </div>
                  )
                })
              }
            </MainMain>
          </MainComponentMain>

          // Akhir




        )
      }
    </MainComponent>
  );
}

function Footer(props) {
  return (
    <FooterComponent>
      Made By ♥ by <a href="https://elbi.vercel.app">{"  "}Rhafael Bijaksana</a>
    </FooterComponent>
  );
}

// Style Component
const Box = styled.div`
  color: white;
  background-color: rgb(30, 35, 53);
  border: 1px solid black;
  border-radius: 0.8rem;
`;

const Container = styled.div`
  width: 90%;
  margin: 0.8rem auto;
  background-color: rgb(23, 25, 36);
  border-radius: 0.8rem;
  padding: 1.5rem;
  height: 90vh;
  display: grid;
  gap: 1rem;
  box-sizing: border-box;

  @media (max-width: 576px) {
    & {
      height: 100%;
      overflow: auto;
    }
  }
`;

const HeaderContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

const HeaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    color: white;
  };

  @media (max-width: 576px) {
    & {
      flex-wrap: wrap;
      justify-content: center;
    };
  };  
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

const HeaderLastUpdate = styled(Box)`
  padding: 0.5rem;
  font-size: 1.3rem;
  text-align: center;
`;

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
  };

  .kasus {
    font-size: 2.5rem;
  };

 @media (max-width: 992px) {
    .icon {
      font-size: 2rem;
    };

    .main-content {
      margin-left: 0.5rem;
      font-size: 1.3rem;
    };

    .kasus {
      font-size: 2rem;
    };
  } ;

 @media (max-width: 768px) {
    .icon {
      font-size: 1.5rem;
    };

    .main-content {
      margin-left: 0.5rem;
      font-size: 1rem;
    };

    .kasus {
      font-size: 1.5rem;
    };
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

const ToggleParent = styled.div`
  display: flex;
  @media (max-width: 576px) {
    & {
      justify-content: space-between;
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
  };

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  };

  &::-webkit-scrollbar-thumb {
    background: #888;
  };

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  };
`;

const MainComponentMain = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  overflow: auto;
  

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
  };

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  };

  &::-webkit-scrollbar-thumb {
    background: #888;
  };

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  };
  
`;


const FooterComponent = styled.div`
  color: white;
  padding: 0.5rem;
  display: flex;
  justify-content: center;

  a {
    text-decoration: underline;
    color: white;
  }
`;