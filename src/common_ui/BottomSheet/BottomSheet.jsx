import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../../styles/theme";

/*

목적: 프로젝트 공용 바텀시트 컴포넌트

사용법:
<BottomSheet
  stage="collapsed | half | full"
  onStageChange={(stage) => {}}
  header={<SortTabs ... />}
  label="꿀팁 목록"
>
  ...스크롤될 내용...
</BottomSheet>

설명 (2. Component Description.md):
- collapsed (1단)
  - 기본 상태. 그래버만 노출됩니다.
- half (2단)
  - 핀을 클릭했을 때 보여줄 게시글이 1개인 경우
- full (3단)
  - 핀을 클릭했을 때 보여줄 게시글이 2개 이상인 경우

props:
- stage         : 현재 단계. 넘기지 않으면 컴포넌트 내부 상태로 동작합니다.
- defaultStage  : 내부 상태로 쓸 때의 초기 단계. 기본값 collapsed
- onStageChange : 단계가 바뀔 때 호출
- header        : 그래버 아래에 고정으로 붙는 영역(정렬 선택 등). 함께 드래그됩니다.
- label         : 스크린리더용 이름
- children      : 스크롤 영역에 들어갈 내용

조작:
- 그래버를 드래그하면 가장 가까운 단계로 스냅합니다.
- 그래버를 클릭(또는 Enter/Space)하면 다음 단계로 순환합니다.
- 3단에서만 내용이 스크롤됩니다.

부모 요소는 position: relative 여야 합니다.

*/

const STAGES = ["collapsed", "half", "full"];

function remToPx(rem) {
  const rootFontSize =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  return parseFloat(rem) * rootFontSize;
}

const Sheet = styled.section`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.layer.sheet};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg} ${({ theme }) => theme.radius.lg} 0 0;
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};
  touch-action: none;
  transition: ${({ $dragging }) => ($dragging ? "none" : "height 0.25s ease")};
`;

const Grabber = styled.button`
  display: grid;
  flex: none;
  place-items: center;
  width: 100%;
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }

  &::before {
    content: "";
    width: 2.25rem;
    height: 0.3125rem;
    border-radius: 0.25rem;
    background: ${({ theme }) => theme.color.handle};
  }

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: -0.25rem;
  }
`;

const Header = styled.div`
  flex: none;
  padding-bottom: 0.75rem;
  touch-action: none;
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: ${({ $scrollable }) => ($scrollable ? "auto" : "hidden")};
  overscroll-behavior: contain;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  touch-action: ${({ $scrollable }) => ($scrollable ? "pan-y" : "none")};
  transition: opacity 0.2s ease;

  /* 스크롤은 되지만 스크롤바는 보이지 않게 합니다. */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* 구형 Edge */

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
`;

export default function BottomSheet({
  stage: controlledStage,
  defaultStage = "collapsed",
  onStageChange,
  header,
  label = "꿀팁 목록",
  children,
}) {
  const sheetRef = useRef(null);
  const dragRef = useRef(null);
  // 드래그로 스냅한 직후 따라오는 click 이벤트를 한 번 무시하기 위한 표시입니다.
  const skipNextClickRef = useRef(false);
  const [innerStage, setInnerStage] = useState(defaultStage);
  const [containerHeight, setContainerHeight] = useState(0);
  const [dragHeight, setDragHeight] = useState(null);

  const stage = controlledStage ?? innerStage;

  const changeStage = useCallback(
    (nextStage) => {
      setInnerStage(nextStage);
      onStageChange?.(nextStage);
    },
    [onStageChange],
  );

  // 부모 높이를 기준으로 각 단계의 노출 높이를 계산합니다.
  useLayoutEffect(() => {
    const parent = sheetRef.current?.parentElement;

    if (!parent) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });

    observer.observe(parent);
    setContainerHeight(parent.clientHeight);

    return () => observer.disconnect();
  }, []);

  const getStageHeights = useCallback(() => {
    if (!containerHeight) return null;

    const collapsed = remToPx(theme.sheetStage.collapsed);
    const half = remToPx(theme.sheetStage.half);
    const full = containerHeight - remToPx(theme.sheetStage.fullInset);

    return {
      collapsed: Math.min(collapsed, full),
      half: Math.min(half, full),
      full: Math.max(full, collapsed),
    };
  }, [containerHeight]);

  const stageHeights = getStageHeights();
  const height = dragHeight ?? stageHeights?.[stage] ?? 0;

  const handlePointerDown = (event) => {
    if (!stageHeights) return;

    skipNextClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: stageHeights[stage],
    };
    setDragHeight(stageHeights[stage]);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId || !stageHeights) return;

    const next = drag.startHeight + (drag.startY - event.clientY);

    setDragHeight(
      Math.min(Math.max(next, stageHeights.collapsed), stageHeights.full),
    );
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId || !stageHeights) return;

    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const moved = Math.abs(drag.startY - event.clientY);
    setDragHeight(null);

    // 거의 움직이지 않았다면 탭으로 보고 click 핸들러에 넘깁니다.
    // (키보드 Enter/Space도 click으로만 들어오므로 한 곳에서 처리합니다.)
    if (moved < 6) return;

    skipNextClickRef.current = true;

    const released = drag.startHeight + (drag.startY - event.clientY);
    const nearest = STAGES.reduce((closest, candidate) =>
      Math.abs(stageHeights[candidate] - released) <
      Math.abs(stageHeights[closest] - released)
        ? candidate
        : closest,
    );

    if (nearest !== stage) changeStage(nearest);
  };

  // 탭 / 키보드(Enter, Space)로 다음 단계로 순환합니다.
  const handleClick = () => {
    if (skipNextClickRef.current) {
      skipNextClickRef.current = false;
      return;
    }

    changeStage(STAGES[(STAGES.indexOf(stage) + 1) % STAGES.length]);
  };

  // 단계가 바뀌면 스크롤 위치를 위로 되돌립니다.
  const contentRef = useRef(null);

  useEffect(() => {
    if (stage !== "full" && contentRef.current) contentRef.current.scrollTop = 0;
  }, [stage]);

  return (
    <Sheet
      ref={sheetRef}
      aria-label={label}
      style={{ height: `${height}px` }}
      $dragging={dragHeight !== null}
    >
      <Grabber
        type="button"
        aria-label={`${label} 크기 조절`}
        aria-expanded={stage === "full"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      />

      {header && <Header>{header}</Header>}

      <Content
        ref={contentRef}
        $scrollable={stage === "full"}
        $hidden={stage === "collapsed"}
        aria-hidden={stage === "collapsed"}
      >
        {children}
      </Content>
    </Sheet>
  );
}
