import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { EditIcon, HomeIcon, UserIcon } from "../Icon/Icons";

/*
목적: 하단 네비바 (IA - 하단 네비바)
      홈 / 게시판 / My 세 개의 최상위 메뉴를 연결합니다.
*/

const MENUS = [
  { to: "/", label: "홈", Icon: HomeIcon, end: true },
  { to: "/board", label: "게시판", Icon: EditIcon },
  { to: "/user", label: "My", Icon: UserIcon },
];

const Nav = styled.nav`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-around;
  height: 3.75rem;
  padding: 0 2rem;
  background: ${({ theme }) => theme.color.surfaceMuted};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const MenuLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: center;
  min-width: 2.5rem;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.color.brandStrong};
  }
`;

export default function Footer() {
  return (
    <Nav aria-label="주요 메뉴">
      {MENUS.map(({ to, label, Icon, end }) => (
        <MenuLink key={to} to={to} end={end}>
          <Icon />
          <span>{label}</span>
        </MenuLink>
      ))}
    </Nav>
  );
}
