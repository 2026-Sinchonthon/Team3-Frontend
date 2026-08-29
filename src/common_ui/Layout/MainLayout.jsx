import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
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
