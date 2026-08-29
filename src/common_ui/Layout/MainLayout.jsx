import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: min(100%, 23.4375rem);
  height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0;
`;

export default function MainLayout() {
  return (
    <Layout>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Layout>
  );
}
