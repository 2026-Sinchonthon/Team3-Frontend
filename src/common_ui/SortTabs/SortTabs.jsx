import styled from "styled-components";
import Chip from "../Chip/Chip";
import { getSortOptions } from "../../constants/sortOptions";

/*
목적: 바텀시트 / 게시판의 정렬 선택 (2. Component Description.md - 정렬 선택)

사용법:
<SortTabs value={sort} onChange={setSort} isSearch={false} />

props:
- value    : 선택된 정렬 id
- onChange : 정렬 id를 인자로 호출
- isSearch : true면 "관련도순"을 함께 노출합니다(검색 결과 전용)
*/

const List = styled.div`
  display: flex;
  gap: 0.5625rem;
  justify-content: flex-end;
  padding: 0 0.625rem;
`;

export default function SortTabs({ value, onChange, isSearch = false }) {
  return (
    <List role="group" aria-label="정렬 기준">
      {getSortOptions({ isSearch }).map((option) => (
        <Chip
          key={option.id}
          size="sm"
          selected={value === option.id}
          onClick={() => onChange?.(option.id)}
        >
          {option.label}
        </Chip>
      ))}
    </List>
  );
}
