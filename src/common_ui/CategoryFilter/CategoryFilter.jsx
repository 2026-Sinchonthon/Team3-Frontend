import styled from "styled-components";
import Chip from "../Chip/Chip";
import { CATEGORIES } from "../../constants/categories";

/*
목적: 홈 / 게시판의 카테고리 필터 (IA - 카테고리)

사용법:
<CategoryFilter selectedIds={["HEALTH"]} onToggle={handleToggle} />

props:
- selectedIds : 선택된 카테고리 id 배열. 빈 배열이면 전체 노출
- onToggle    : 칩을 눌렀을 때 해당 카테고리 id를 인자로 호출
*/

const List = styled.div`
  display: flex;
  gap: 0.5625rem;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function CategoryFilter({
  categories = CATEGORIES,
  selectedIds = [],
  onToggle,
}) {
  return (
    <List role="group" aria-label="카테고리 필터">
      {categories.map((category) => (
        <Chip
          key={category.id}
          selected={selectedIds.includes(category.id)}
          onClick={() => onToggle?.(category.id)}
        >
          {category.name ?? category.tag}
        </Chip>
      ))}
    </List>
  );
}
