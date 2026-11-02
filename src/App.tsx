import { useEffect, useRef, useState } from "react";

import { getResultProfile, questions, resultProfiles, type ResultId } from "./data";
import { calculateResult, type AnswerSelection } from "./scoring";

type Screen = "home" | "quiz" | "result" | "about" | "privacy";

const siteUrl = "https://bond-type.netlify.app/";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selections, setSelections] = useState<Array<AnswerSelection | null>>(
    () => Array(questions.length).fill(null),
  );
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultId = calculateResult(selections);
  const result = getResultProfile(resultId);
  const question = questions[questionIndex];

  useEffect(() => {
    if (screen === "quiz") questionHeading.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen, questionIndex]);

  function startTest() {
    setSelections(Array(questions.length).fill(null));
    setQuestionIndex(0);
    setNotice("");
    setScreen("quiz");
  }

  function selectAnswer(answerIndex: number) {
    const nextSelections = [...selections];
    nextSelections[questionIndex] = { questionIndex, answerIndex };
    setSelections(nextSelections);

    if (questionIndex === questions.length - 1) {
      setScreen("result");
    } else {
      setQuestionIndex((current) => current + 1);
    }
  }

  function goBack() {
    if (questionIndex === 0) {
      setScreen("home");
      return;
    }
    setQuestionIndex((current) => current - 1);
  }

  function goHome() {
    setNotice("");
    setScreen("home");
  }

  async function copyText(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("링크를 복사하지 못했어요.");
  }

  async function shareResult() {
    const fileName = `bond-type-${result.id}.png`;

    setIsSharing(true);
    setNotice("");
    let copyError = "";
    try {
      try {
        await copyText(siteUrl);
      } catch (error) {
        copyError = error instanceof Error ? error.message : "링크를 복사하지 못했어요.";
      }

      const blob = await createResultPng(resultId, siteUrl);
      const file = new File([blob], fileName, { type: "image/png" });
      const linkInstruction = copyError
        ? `링크 자동 복사에 실패했어요 (${copyError}). Instagram 스토리에서 링크 스티커에 ${siteUrl}을 입력해 주세요.`
        : "Instagram 스토리에서 링크 스티커를 추가하고, 붙여넣기로 복사된 사이트 주소를 넣어 주세요.";

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        setNotice(linkInstruction);
        return;
      }

      downloadBlob(blob, fileName);
      setNotice(`결과 이미지를 저장했어요. ${linkInstruction}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setNotice("이미지 공유를 취소했어요. 사이트 주소는 클립보드에 복사되어 있어요.");
        return;
      }
      setNotice(
        error instanceof Error
          ? error.message
          : "공유하지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      setIsSharing(false);
    }
  }

  async function downloadResult() {
    setIsSaving(true);
    setNotice("");
    try {
      const blob = await createResultPng(resultId);
      downloadBlob(blob, `bond-type-${result.id}.png`);
      setNotice("결과 카드를 PNG로 저장했어요.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "이미지를 저장하지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="wordmark" onClick={goHome} aria-label="BOND TYPE 홈">
          BOND TYPE
        </button>
        <nav aria-label="주요 메뉴">
          <button onClick={() => setScreen("about")}>소개</button>
          <button onClick={() => setScreen("privacy")}>개인정보</button>
        </nav>
      </header>

      <main>
        {screen === "home" && (
          <section className="home-page" aria-labelledby="home-title">
            <div className="hero-copy">
              <p className="eyebrow">DISCOVER YOUR FRIENDSHIP STYLE</p>
              <h1 id="home-title">친구들 사이에서<br />나는 어떤 사람일까?</h1>
              <p className="hero-description">
                나도 몰랐던 나의 친구 관계 스타일을 발견해 봐.
              </p>
              <button className="primary-button start-button" onClick={startTest}>
                테스트 시작하기 <span aria-hidden="true">→</span>
              </button>
              <p className="duration-note">총 10개 질문 · 약 2분 소요</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-core">
                <span>우리는</span>
                <span>서로 다른</span>
                <strong>친구</strong>
              </div>
              <span className="art-label label-one">LISTEN</span>
              <span className="art-label label-two">CONNECT</span>
              <span className="art-label label-three">GROW</span>
            </div>
            <p className="disclaimer">
              이 테스트는 오락을 위한 콘텐츠이며 심리 진단이 아닙니다.
            </p>
          </section>
        )}

        {screen === "quiz" && question && (
          <section className="quiz-page" aria-labelledby="question-title">
            <div className="quiz-topline">
              <button className="text-button back-button" onClick={goBack}>
                <span aria-hidden="true">←</span>{" "}
                {questionIndex === 0 ? "처음으로" : "이전 질문"}
              </button>
              <span className="question-count">
                {String(questionIndex + 1).padStart(2, "0")}{" "}
                <span>/ {String(questions.length).padStart(2, "0")}</span>
              </span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="테스트 진행률"
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-valuenow={questionIndex + 1}
            >
              <div
                className="progress-fill"
                style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="question-content">
              <p className="eyebrow">A LITTLE ABOUT YOU</p>
              <h1 id="question-title" ref={questionHeading} tabIndex={-1}>
                {question.prompt}
              </h1>
              <p className="question-hint">가장 나다운 답을 골라 주세요.</p>
              <div className="answer-list">
                {question.answers.map((answer) => (
                  <button
                    className={`answer-option${selections[questionIndex]?.answerIndex === Number(answer.label.charCodeAt(0) - 65) ? " selected" : ""}`}
                    key={answer.label}
                    onClick={() => selectAnswer(answer.label.charCodeAt(0) - 65)}
                  >
                    <span className="answer-letter">{answer.label}</span>
                    <span>{answer.text}</span>
                    <span className="answer-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <p className="quiz-privacy-note">
                답변은 이 브라우저에서만 계산되며 서버로 전송되지 않아요.
              </p>
            </div>
          </section>
        )}

        {screen === "result" && (
          <section className="result-page" aria-labelledby="result-title">
            <div className="result-heading">
              <p className="eyebrow">YOUR BOND TYPE</p>
              <h1 id="result-title">너의 친구 관계 스타일</h1>
              <p>답변을 바탕으로 발견한 너만의 관계 방식이에요.</p>
            </div>
            <ResultCard resultId={resultId} />
            <div className="result-actions">
              <button
                className="primary-button"
                onClick={downloadResult}
                disabled={isSaving || isSharing}
              >
                {isSaving ? "이미지 만드는 중..." : "결과 이미지 저장"}
              </button>
              <button
                className="secondary-button"
                onClick={shareResult}
                disabled={isSaving || isSharing}
              >
                {isSharing ? "공유 준비 중..." : "결과 공유하기"}
              </button>
              <button className="text-button retry-button" onClick={startTest}>
                다시 테스트하기
              </button>
            </div>
            <p className="share-notice" role="status" aria-live="polite">
              {notice}
            </p>
            <div className="ad-placeholder" aria-label="광고 영역">
              <span>AD</span>
              <p>광고 영역 · 추후 광고 설정 시 표시됩니다</p>
            </div>
            <p className="disclaimer">
              이 테스트는 오락을 위한 콘텐츠이며 심리 진단이나 전문적인 조언이 아닙니다.
            </p>
          </section>
        )}

        {screen === "about" && (
          <InfoPage
            eyebrow="ABOUT BOND TYPE"
            title="친구 사이의 나를 가볍게 발견해요."
            onBack={goHome}
          >
            <p>
              BOND TYPE은 친구 관계에서 내가 어떤 방식으로 마음을 나누는지 돌아보는
              짧은 성격 테스트입니다. 정답은 없어요. 지금의 나를 가장 잘 설명하는
              답을 골라 보세요.
            </p>
            <p>
              이름이나 연락처를 묻지 않으며 답변과 결과는 브라우저 안에서만 계산됩니다.
              이 테스트는 오락용이며 심리 진단이 아닙니다.
            </p>
          </InfoPage>
        )}

        {screen === "privacy" && (
          <InfoPage
            eyebrow="PRIVACY"
            title="당신의 답변은 당신의 기기에 머물러요."
            onBack={goHome}
          >
            <h2>수집하는 정보</h2>
            <p>
              이 테스트는 이름, 전화번호 등 개인정보를 요구하지 않아요. 답변은 결과를
              계산하기 위해서만 사용되고 서버로 전송되거나 저장되지 않습니다.
            </p>
            <h2>공유와 이미지 저장</h2>
            <p>
              결과 이미지 저장과 생성은 이 브라우저에서 처리돼요. 이미지 공유를
              지원하는 기기에서는 이미지 파일만 기기의 공유 메뉴로 전달해 앱을 선택할
              수 있고, 스토리에서 링크 스티커를 추가해 복사된 사이트 주소를 붙여넣으면
              다른 사람이 테스트로 이동할 수 있어요. 이미지 공유를 지원하지 않는
              기기에서는 저장된 이미지를 Instagram 스토리에서 직접 선택하면 됩니다.
              공유와 게시 여부는 사용자가 직접 선택해요.
            </p>
            <h2>광고</h2>
            <p>
              결과 화면에 표시된 광고 영역은 향후 광고 설정을 위한 자리이며, 현재
              실제 광고를 불러오거나 광고 관련 추적을 하지 않습니다.
            </p>
          </InfoPage>
        )}
      </main>

      <footer className="site-footer">
        <button className="footer-wordmark" onClick={goHome}>BOND TYPE</button>
        <span>친구 사이의 나를 발견하는 시간</span>
      </footer>
    </div>
  );
}

function InfoPage({
  eyebrow,
  title,
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="info-page">
      <button className="text-button back-button" onClick={onBack}>
        <span aria-hidden="true">←</span> 홈으로
      </button>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="info-copy">{children}</div>
    </section>
  );
}

function ResultCard({ resultId }: { resultId: ResultId }) {
  const result = getResultProfile(resultId);
  return (
    <article className={`result-card result-${result.id}`}>
      <div className="card-topline">
        <span>BOND TYPE</span>
        <span>FRIENDSHIP STYLE / 0{resultProfiles.indexOf(result) + 1}</span>
      </div>
      <div className="card-accent" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="card-kicker">나의 친구 관계 스타일</p>
      <h2>{result.name}</h2>
      <p className="card-intro">{result.intro}</p>
      <div className="card-divider" />
      <div className="card-section">
        <h3>나의 특징</h3>
        <ul>
          {result.traits.map((trait) => <li key={trait}>{trait}</li>)}
        </ul>
      </div>
      <div className="card-section two-column">
        <div>
          <h3>친구 관계에서의 강점</h3>
          <p>{result.strength}</p>
        </div>
        <div>
          <h3>기억하면 좋은 점</h3>
          <p>{result.reminder}</p>
        </div>
      </div>
      <div className="card-footer">
        <span>DISCOVER YOUR FRIENDSHIP STYLE</span>
        <span>bond type</span>
      </div>
    </article>
  );
}

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text: string, limit: number) {
  const chars = Array.from(text);
  const lines: string[] = [];
  for (let index = 0; index < chars.length; index += limit) {
    lines.push(chars.slice(index, index + limit).join(""));
  }
  return lines;
}

function svgText(
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 400,
) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}">${xmlEscape(text)}</text>`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function createResultPng(resultId: ResultId, url = siteUrl) {
  const result = getResultProfile(resultId);
  const width = 1080;
  const height = 1350;
  const charcoal = "#252525";
  const muted = "#74716d";
  const accent = "#8c7ea8";
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" rx="28" fill="#F7F5F0"/>`,
    `<rect x="34" y="34" width="1012" height="1282" rx="20" fill="none" stroke="#dedbd5" stroke-width="2"/>`,
    svgText("BOND TYPE", 92, 116, 28, charcoal, 700),
    svgText("DISCOVER YOUR FRIENDSHIP STYLE", 92, 158, 16, muted, 500),
    `<circle cx="910" cy="106" r="20" fill="#d9d0e7"/><circle cx="960" cy="106" r="12" fill="${accent}"/><circle cx="994" cy="106" r="7" fill="#c6b8d9"/>`,
    svgText("나의 친구 관계 스타일", 92, 268, 22, accent, 600),
    svgText(result.name, 92, 356, 66, charcoal, 700),
  ];

  let y = 418;
  for (const line of wrapText(result.intro, 27)) {
    parts.push(svgText(line, 92, y, 28, muted));
    y += 44;
  }
  y += 28;
  parts.push(`<line x1="92" y1="${y}" x2="988" y2="${y}" stroke="#d9d5ce" stroke-width="2"/>`);
  y += 66;
  parts.push(svgText("나의 특징", 92, y, 24, charcoal, 700));
  y += 52;
  for (const trait of result.traits) {
    parts.push(`<circle cx="104" cy="${y - 9}" r="5" fill="${accent}"/>`);
    parts.push(svgText(trait, 128, y, 24, charcoal));
    y += 48;
  }
  y += 32;
  parts.push(svgText("친구 관계에서의 강점", 92, y, 24, charcoal, 700));
  y += 48;
  for (const line of wrapText(result.strength, 31)) {
    parts.push(svgText(line, 92, y, 22, muted));
    y += 38;
  }
  y += 26;
  parts.push(svgText("기억하면 좋은 점", 92, y, 24, charcoal, 700));
  y += 48;
  for (const line of wrapText(result.reminder, 31)) {
    parts.push(svgText(line, 92, y, 22, muted));
    y += 38;
  }
  parts.push(`<line x1="92" y1="1220" x2="988" y2="1220" stroke="#d9d5ce" stroke-width="2"/>`);
  parts.push(svgText("A SMALL TEST, A LITTLE MORE UNDERSTANDING", 92, 1268, 15, muted, 500));
  parts.push(svgText("BOND TYPE", 850, 1268, 18, charcoal, 700));
  parts.push(svgText(`나도 해보기  ·  ${url.replace(/^https?:\/\//, "").replace(/\/$/, "")}`, 92, 1300, 17, accent, 600));
  parts.push("</svg>");

  const svgBlob = new Blob([parts.join("")], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이미지를 준비하지 못했어요.");
    context.drawImage(image, 0, 0, width, height);

    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG 이미지로 변환하지 못했어요."));
      }, "image/png");
    });
    return png;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default App;
