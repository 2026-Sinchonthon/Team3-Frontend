import styled from "styled-components";
import { findCategory } from "../../constants/categories";
import getResidenceLabel from "../../constants/residence";

/*
목적: 바텀시트 / 게시판에 공통으로 쓰는 꿀팁 리스트 항목
      (2. Component Description.md - 바텀시트 내에 표시할 것들)

표시 항목: 닉네임 + 신뢰도 / 카테고리 / 제목 / 내용 1줄

사용법:
<TipListItem tip={tip} onSelect={() => navigate(`/tips/${tip.id}`)} />

props:
- tip      : { id, title, content, categoryId, author: { nickname, residenceYears, trustScore } }
- onSelect : 항목 클릭 시 호출(게시판 게시글로 이동)
*/

const Item = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
  padding: 0.625rem 0.9375rem;
  border: 0;
  border-top: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  text-align: left;
  cursor: pointer;

  & + & {
    border-top-color: transparent;
  }

  &:active {
    background: ${({ theme }) => theme.color.surfaceMuted};
  }

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: -0.125rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`;

const Nickname = styled.strong`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.md};
  font-weight: 700;
  line-height: 1.2;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.125rem 0.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.brandSoft};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
  line-height: 1.2;
  white-space: nowrap;
`;

const CategoryTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.brand};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.2;
  white-space: nowrap;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
`;

const Content = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function TipListItem({ tip, onSelect }) {
  const category = findCategory(tip.categoryId);
  const author = tip.author ?? {};

  return (
    <Item type="button" onClick={() => onSelect?.(tip)}>
      <MetaRow>
        <Nickname>{author.nickname}</Nickname>
        <TrustBadge>
          <span>{getResidenceLabel(author.residenceYears)}</span>
          <span>{Math.round(Number(author.trustScore) || 0)}%</span>
        </TrustBadge>
        {category && <CategoryTag>{category.tag}</CategoryTag>}
      </MetaRow>

      <Body>
        <Title>{tip.title}</Title>
        <Content>{tip.content}</Content>
      </Body>
    </Item>
  );
}
