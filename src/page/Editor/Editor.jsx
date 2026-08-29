import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import StaticLocationMap from "../../common_ui/StaticLocationMap/StaticLocationMap";
import { createTip } from "../../util/TipAPI";

const Container = styled.section`
  width: min(100%, 40rem);
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const Heading = styled.h1`
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  height: 2.75rem;
  padding: 0 0.875rem;
  border: 0.0625rem solid #d7d7d7;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 10rem;
  padding: 0.875rem;
  border: 0.0625rem solid #d7d7d7;
  border-radius: 0.5rem;
  font: inherit;
  resize: vertical;
`;

const LocationBox = styled.div`
  padding: 1rem;
  border: 0.0625rem solid #dedede;
  border-radius: 0.5rem;
  background: #fff;
`;

const LocationName = styled.strong`
  display: block;
  margin-bottom: 0.375rem;
`;

const LocationDetail = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.875rem;
`;

const SaveButton = styled.button`
  justify-self: start;
  width: 8rem;
  height: 2.75rem;
  border: 0;
  border-radius: 0.5rem;
  background: #222;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export default function Editor() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [selectedLocation] = useState(routeLocation.state?.location ?? null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const closeAlert = () => setAlert(null);

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedLocation || !title.trim() || !content.trim()) {
      setAlert({
        color: "yellow",
        title: "입력 내용을 확인해 주세요",
        content: "장소, 제목, 내용을 모두 입력해야 합니다.",
      });
      return;
    }

    try {
      setIsSaving(true);
      await createTip({
        title: title.trim(),
        content: content.trim(),
        location: selectedLocation,
      });
      setAlert({
        color: "green",
        title: "저장 완료",
        content: "팁이 저장되었습니다.",
        success: true,
      });
    } catch (error) {
      setAlert({
        color: "red",
        title: "저장 실패",
        content: error.message || "팁을 저장하지 못했습니다.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Heading>팁 작성</Heading>
      <Form onSubmit={handleSave}>
        <Field>
          제목
          <Input
            value={title}
            placeholder="제목을 입력해 주세요"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>

        <Field>
          내용
          <Textarea
            value={content}
            placeholder="공유할 팁을 입력해 주세요"
            onChange={(event) => setContent(event.target.value)}
          />
        </Field>

        <div>
          <Field as="span">선택한 위치</Field>
          <LocationBox>
            {selectedLocation ? (
              <>
                <LocationName>{selectedLocation.name}</LocationName>
                <LocationDetail>{selectedLocation.address}</LocationDetail>
                <LocationDetail>
                  {selectedLocation.lat}, {selectedLocation.lng}
                </LocationDetail>
                <StaticLocationMap location={selectedLocation} />
              </>
            ) : (
              <LocationDetail>선택된 위치가 없습니다.</LocationDetail>
            )}
          </LocationBox>
        </div>

        <SaveButton type="submit" disabled={isSaving}>
          저장
        </SaveButton>
      </Form>

      {isSaving && (
        <AlertModal type="loading" title="저장 중" content="잠시만 기다려 주세요." />
      )}

      {alert && (
        <AlertModal
          type="alert"
          color={alert.color}
          title={alert.title}
          content={alert.content}
          onConfirm={alert.success ? () => navigate("/") : closeAlert}
          onClose={alert.success ? () => navigate("/") : closeAlert}
        />
      )}
    </Container>
  );
}
