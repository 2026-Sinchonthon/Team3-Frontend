import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { searchUsers } from "../../util/UserAPI";
import searchPlaces from "../../util/searchPlaces";

const SEARCH_TYPES = {
  PLACE: "place",
  USER: "user",
};

const Container = styled.section`
  width: min(100%, 40rem);
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const SearchTypeSelect = styled.select`
  height: 2.75rem;
  padding: 0 0.625rem;
  border: 0.0625rem solid #d7d7d7;
  border-radius: 0.5rem;
  background: #fff;
  font-size: 0.875rem;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 2.75rem;
  padding: 0 0.875rem;
  border: 0.0625rem solid #d7d7d7;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  height: 2.75rem;
  padding: 0 1rem;
  border: 0;
  border-radius: 0.5rem;
  background: #222;
  color: #fff;
  cursor: pointer;
`;

const Heading = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.25rem;
`;

const List = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  gap: 0.75rem;
  list-style: none;
`;

const ResultButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid #dedede;
  border-radius: 0.5rem;
  background: #fff;
  text-align: left;
  cursor: pointer;
`;

const ResultItem = styled.article`
  padding: 1rem;
  border: 0.0625rem solid #dedede;
  border-radius: 0.5rem;
  background: #fff;
`;

const Name = styled.strong`
  display: block;
  margin-bottom: 0.375rem;
  font-size: 1rem;
`;

const Detail = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const Message = styled.p`
  margin: 2rem 0;
  color: #666;
  text-align: center;
`;

export default function SearchResult() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const queryType = searchParams.get("type");
  const activeType =
    queryType === SEARCH_TYPES.USER ? SEARCH_TYPES.USER : SEARCH_TYPES.PLACE;
  const searchKey = `${activeType}:${query}`;
  const [keyword, setKeyword] = useState(query);
  const [searchType, setSearchType] = useState(activeType);
  const [searchState, setSearchState] = useState({
    key: "",
    results: [],
    error: "",
  });
  const isCurrentSearch = searchState.key === searchKey;
  const isLoading = Boolean(query) && !isCurrentSearch;
  const results = isCurrentSearch ? searchState.results : [];
  const error = isCurrentSearch ? searchState.error : "";

  useEffect(() => {
    let isActive = true;

    if (!query) return undefined;

    const request =
      activeType === SEARCH_TYPES.PLACE ? searchPlaces(query) : searchUsers(query);

    request
      .then((searchResults) => {
        if (isActive) {
          setSearchState({ key: searchKey, results: searchResults, error: "" });
        }
      })
      .catch((searchError) => {
        if (isActive) {
          setSearchState({
            key: searchKey,
            results: [],
            error: searchError.message,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [activeType, query, searchKey]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return;
    setSearchParams({ type: searchType, q: trimmedKeyword });
  };

  return (
    <Container>
      <SearchForm role="search" onSubmit={handleSubmit}>
        <SearchTypeSelect
          value={searchType}
          aria-label="검색 유형"
          onChange={(event) => setSearchType(event.target.value)}
        >
          <option value={SEARCH_TYPES.PLACE}>장소</option>
          <option value={SEARCH_TYPES.USER}>유저</option>
        </SearchTypeSelect>
        <SearchInput
          type="search"
          value={keyword}
          enterKeyHint="search"
          placeholder={
            searchType === SEARCH_TYPES.PLACE
              ? "장소를 검색해 보세요"
              : "유저를 검색해 보세요"
          }
          aria-label="검색어"
          onChange={(event) => setKeyword(event.target.value)}
        />
        <SearchButton type="submit">검색</SearchButton>
      </SearchForm>

      {query ? (
        <>
          <Heading>“{query}” 검색 결과</Heading>
          {isLoading ? (
            <Message>검색 중입니다.</Message>
          ) : error ? (
            <Message>{error}</Message>
          ) : results.length > 0 ? (
            <List>
              {results.map((result) => (
                <li key={result.id}>
                  {activeType === SEARCH_TYPES.PLACE ? (
                    <ResultButton
                      type="button"
                      onClick={() =>
                        navigate(
                          `/places/${encodeURIComponent(result.id)}/tips`,
                          { state: { location: result } },
                        )
                      }
                    >
                      <Name>{result.name}</Name>
                      <Detail>{result.address}</Detail>
                    </ResultButton>
                  ) : (
                    <ResultItem>
                      <Name>{result.nickname || result.name}</Name>
                      {result.introduction && (
                        <Detail>{result.introduction}</Detail>
                      )}
                    </ResultItem>
                  )}
                </li>
              ))}
            </List>
          ) : (
            <Message>검색 결과가 없습니다.</Message>
          )}
        </>
      ) : (
        <Message>검색어를 입력해 주세요.</Message>
      )}
    </Container>
  );
}
