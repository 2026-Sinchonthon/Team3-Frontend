import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import mockLocations from "../../data/mockLocations";

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

const Name = styled.strong`
  display: block;
  margin-bottom: 0.375rem;
  font-size: 1rem;
`;

const Address = styled.span`
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
  const [keyword, setKeyword] = useState(query);
  const normalizedQuery = query.toLowerCase();
  const results = query
    ? mockLocations.filter(
        ({ name, address }) =>
          name.toLowerCase().includes(normalizedQuery) ||
          address.toLowerCase().includes(normalizedQuery),
      )
    : [];

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return;
    setSearchParams({ q: trimmedKeyword });
  };

  return (
    <Container>
      <SearchForm role="search" onSubmit={handleSubmit}>
        <SearchInput
          type="search"
          value={keyword}
          enterKeyHint="search"
          placeholder="장소를 검색해 보세요"
          aria-label="장소 검색어"
          onChange={(event) => setKeyword(event.target.value)}
        />
        <SearchButton type="submit">검색</SearchButton>
      </SearchForm>

      {query ? (
        <>
          <Heading>“{query}” 검색 결과</Heading>
          {results.length > 0 ? (
            <List>
              {results.map((location) => (
                <li key={location.id}>
                  <ResultButton
                    type="button"
                    onClick={() => navigate("/editor", { state: { location } })}
                  >
                    <Name>{location.name}</Name>
                    <Address>{location.address}</Address>
                  </ResultButton>
                </li>
              ))}
            </List>
          ) : (
            <Message>검색 결과가 없습니다.</Message>
          )}
        </>
      ) : (
        <Message>팁을 작성할 장소를 검색해 주세요.</Message>
      )}
    </Container>
  );
}
