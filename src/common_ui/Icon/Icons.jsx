/*
 * Figma `신촌톤` GUI에서 내보낸 아이콘입니다.
 * 원본 SVG는 src/assets/icons/ 에 함께 보관하고 있으며,
 * 활성/비활성 색을 바꿔야 하는 아이콘은 stroke를 currentColor로 바꿔 사용합니다.
 */

const STROKE_PROPS = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function HomeIcon(props) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden="true" {...props}>
      <g stroke="currentColor" {...STROKE_PROPS}>
        <path d="M3.125 9.375L12.5 2.08333L21.875 9.375V20.8333C21.875 21.3859 21.6555 21.9158 21.2648 22.3065C20.8741 22.6972 20.3442 22.9167 19.7917 22.9167H5.20833C4.6558 22.9167 4.12589 22.6972 3.73519 22.3065C3.34449 21.9158 3.125 21.3859 3.125 20.8333V9.375Z" />
        <path d="M9.375 22.9167V12.5H15.625V22.9167" />
      </g>
    </svg>
  );
}

export function EditIcon(props) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden="true" {...props}>
      <g stroke="currentColor" {...STROKE_PROPS}>
        <path d="M11.4583 4.16667H4.16667C3.61413 4.16667 3.08423 4.38616 2.69353 4.77686C2.30283 5.16756 2.08333 5.69747 2.08333 6.25V20.8333C2.08333 21.3859 2.30283 21.9158 2.69353 22.3065C3.08423 22.6972 3.61413 22.9167 4.16667 22.9167H18.75C19.3025 22.9167 19.8324 22.6972 20.2231 22.3065C20.6138 21.9158 20.8333 21.3859 20.8333 20.8333V13.5417" />
        <path d="M19.2708 2.60417C19.6852 2.18977 20.2473 1.95696 20.8333 1.95696C21.4194 1.95696 21.9814 2.18977 22.3958 2.60417C22.8102 3.01857 23.043 3.58062 23.043 4.16667C23.043 4.75272 22.8102 5.31477 22.3958 5.72917L12.5 15.625L8.33333 16.6667L9.375 12.5L19.2708 2.60417Z" />
      </g>
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden="true" {...props}>
      <g stroke="currentColor" {...STROKE_PROPS}>
        <path d="M20.8333 21.875V19.7917C20.8333 18.6866 20.3943 17.6268 19.6129 16.8454C18.8315 16.064 17.7717 15.625 16.6667 15.625H8.33333C7.22827 15.625 6.16846 16.064 5.38706 16.8454C4.60565 17.6268 4.16667 18.6866 4.16667 19.7917V21.875" />
        <path d="M12.5 11.4583C14.8012 11.4583 16.6667 9.59285 16.6667 7.29167C16.6667 4.99048 14.8012 3.125 12.5 3.125C10.1988 3.125 8.33333 4.99048 8.33333 7.29167C8.33333 9.59285 10.1988 11.4583 12.5 11.4583Z" />
      </g>
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9 1C12.866 1 16 4.13401 16 8C16 9.70021 15.3928 11.258 14.3848 12.4707L18.207 16.293C18.5976 16.6835 18.5976 17.3165 18.207 17.707C17.8165 18.0976 17.1835 18.0976 16.793 17.707L12.8994 13.8135C11.785 14.5625 10.4437 15 9 15C5.13401 15 2 11.866 2 8C2 4.13401 5.13401 1 9 1ZM9 2.5C5.96243 2.5 3.5 4.96243 3.5 8C3.5 11.0376 5.96243 13.5 9 13.5C12.0376 13.5 14.5 11.0376 14.5 8C14.5 4.96243 12.0376 2.5 9 2.5Z"
      />
    </svg>
  );
}

export function WriteIcon(props) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden="true" {...props}>
      <g stroke="currentColor" {...STROKE_PROPS}>
        <path d="M17.5858 3.41421C17.8484 3.15157 18.1602 2.94324 18.5034 2.80111C18.8466 2.65893 19.2144 2.58578 19.5858 2.58578C19.9572 2.58578 20.325 2.65893 20.6682 2.80111C21.0113 2.94324 21.3231 3.15157 21.5858 3.41421C21.8484 3.67686 22.0568 3.98869 22.1989 4.33184C22.3411 4.67499 22.4142 5.04283 22.4142 5.41421C22.4142 5.7856 22.3411 6.15343 22.1989 6.49658C22.0568 6.83973 21.8484 7.15157 21.5858 7.41421L8.08579 20.9142L2.58579 22.4142L4.08579 16.9142L17.5858 3.41421Z" />
      </g>
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g stroke="currentColor" {...STROKE_PROPS}>
        <path d="M19 12H5M12 19L5 12L12 5" />
      </g>
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

