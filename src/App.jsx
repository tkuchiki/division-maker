import React, { useState, useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Cookies from "js-cookie";
import "./App.css";

const mathJaxConfig = {
  loader: { load: ["[tex]/enclose"] },
  tex: {
    packages: { "[+]": ["enclose"] },
  },
};

function App() {
  const [problems, setProblems] = useState([]);

  const [problemCount, setProblemCount] = useState(9);
  const [divisorDigits, setDivisorDigits] = useState(1);
  const [dividendDigits, setDividendDigits] = useState(3);
  const [divisorDecimalPlaces, setDivisorDecimalPlaces] = useState(0);
  const [dividendDecimalPlaces, setDividendDecimalPlaces] = useState(0);
  
  const [calcMethod, setCalcMethod] = useState("integer"); // "integer" | "exact" | "round"
  const [roundPlace, setRoundPlace] = useState(1);
  const [remainderOption, setRemainderOption] = useState("mixed");
  
  const [mathFontSize, setMathFontSize] = useState(28);
  const [problemSpacing, setProblemSpacing] = useState(140);
  const [showAnswers, setShowAnswers] = useState(false);

  // ------------------------
  // Loading settings from cookie
  // ------------------------
  useEffect(() => {
    const savedSettings = Cookies.get("divisionSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.problemCount !== undefined) setProblemCount(parsed.problemCount);
        if (parsed.divisorDigits !== undefined) setDivisorDigits(parsed.divisorDigits);
        if (parsed.dividendDigits !== undefined) setDividendDigits(parsed.dividendDigits);
        if (parsed.divisorDecimalPlaces !== undefined) setDivisorDecimalPlaces(parsed.divisorDecimalPlaces);
        if (parsed.dividendDecimalPlaces !== undefined) setDividendDecimalPlaces(parsed.dividendDecimalPlaces);
        if (parsed.calcMethod !== undefined) setCalcMethod(parsed.calcMethod);
        if (parsed.roundPlace !== undefined) setRoundPlace(parsed.roundPlace);
        if (parsed.remainderOption !== undefined) setRemainderOption(parsed.remainderOption);
        if (parsed.mathFontSize !== undefined) setMathFontSize(parsed.mathFontSize);
        if (parsed.problemSpacing !== undefined) setProblemSpacing(parsed.problemSpacing);
        if (parsed.showAnswers !== undefined) setShowAnswers(parsed.showAnswers);
      } catch (err) {
        console.error("Cookie parse error:", err);
      }
    }
  }, []);

  // Use useEffect to save cookie whenever state changes
  useEffect(() => {
    const settings = {
      problemCount,
      divisorDigits,
      dividendDigits,
      divisorDecimalPlaces,
      dividendDecimalPlaces,
      calcMethod,
      roundPlace,
      remainderOption,
      mathFontSize,
      problemSpacing,
      showAnswers
    };
    Cookies.set("divisionSettings", JSON.stringify(settings), { expires: 365 });
  }, [
    problemCount, divisorDigits, dividendDigits, divisorDecimalPlaces, dividendDecimalPlaces,
    calcMethod, roundPlace, remainderOption, mathFontSize, problemSpacing, showAnswers
  ]);

  const generateProblems = () => {
    const newProblems = [];

    for (let i = 0; i < problemCount; i++) {
      while (true) {
        let divisorMin, divisorMax;
        if (divisorDigits === 1) {
          divisorMin = 2;  // 1 は除外
          divisorMax = 9;
        } else {
          divisorMin = 10 ** (divisorDigits - 1);
          divisorMax = 10 ** divisorDigits - 1;
        }

        const dividendMin = 10 ** (dividendDigits - 1);
        const dividendMax = 10 ** dividendDigits - 1;

        const divisorInt = getRandomInt(divisorMin, divisorMax);
        const dividendInt = getRandomInt(dividendMin, dividendMax);

        // 小数点の適用
        const divisor = divisorInt / (10 ** divisorDecimalPlaces);
        const dividend = dividendInt / (10 ** dividendDecimalPlaces);

        let isExact = false;
        let hasRemainder = false;
        let answerStr = "";

        // 計算の誤差を防ぐため、10の累乗を掛けて整数化
        const maxDecimals = Math.max(divisorDecimalPlaces, dividendDecimalPlaces);
        const factor = 10 ** maxDecimals;
        // JSの浮動小数点誤差を防ぐため、Math.round を使用
        const scaledDivisor = Math.round(divisor * factor);
        const scaledDividend = Math.round(dividend * factor);

        if (calcMethod === "integer") {
          // 商を整数で求める
          const quotient = Math.floor(scaledDividend / scaledDivisor);
          const scaledRemainder = scaledDividend % scaledDivisor;
          
          isExact = scaledRemainder === 0;
          hasRemainder = scaledRemainder !== 0;
          
          // 余りを元のスケールに戻す
          // 4.5 ÷ 1.2 を 45 ÷ 12 として計算すると余り9。実際の余りは 0.9。
          // ただし、余りの小数処理で誤差が出ないように。
          let remainderStr = "";
          if (hasRemainder) {
            const remainder = scaledRemainder / factor;
            remainderStr = String(remainder);
          }
          
          answerStr = isExact ? `${quotient}` : `${quotient} 余り ${remainderStr}`;
          
        } else if (calcMethod === "exact") {
          // 割り切れるまで計算する
          const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
          const g = gcd(scaledDividend, scaledDivisor);
          let den = scaledDivisor / g;
          while (den % 2 === 0) den /= 2;
          while (den % 5 === 0) den /= 5;
          
          if (den !== 1) {
            // 循環小数になるため問題として不適切
            continue;
          }
          
          const quotient = scaledDividend / scaledDivisor;
          isExact = true; // 割り切れるので常に余りなし
          hasRemainder = false;
          answerStr = String(quotient);
          
        } else if (calcMethod === "round") {
          // 四捨五入
          const quotient = scaledDividend / scaledDivisor;
          const p = 10 ** roundPlace;
          const rounded = Math.round(quotient * p) / p;
          
          isExact = (rounded === quotient);
          hasRemainder = !isExact;
          // 四捨五入の場合、固定小数点表示にする
          answerStr = `約 ${rounded.toFixed(roundPlace)}`;
        }

        let ok = false;
        switch (remainderOption) {
          case "none":
            if (isExact) ok = true;
            break;
          case "all":
            if (hasRemainder) ok = true;
            break;
          case "mixed":
            ok = true;
            break;
          default:
            ok = true;
        }

        if (ok && divisorInt !== 0) {
          newProblems.push({ dividend, divisor, answerStr });
          break;
        }
      }
    }

    setProblems(newProblems);
  };

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <div className="container">
        <h1>わり算（筆算）問題ジェネレーター</h1>

        <div className="controls">
          <label>
            問題数:
            <input
              type="number"
              min="1"
              value={problemCount}
              onChange={(e) => setProblemCount(Number(e.target.value))}
            />
          </label>

          <label>
            割る数(除数)の桁数:
            <input
              type="number"
              min="1"
              value={divisorDigits}
              onChange={(e) => setDivisorDigits(Number(e.target.value))}
            />
          </label>
          <label>
            割る数(除数)の小数桁数:
            <input
              type="number"
              min="0"
              value={divisorDecimalPlaces}
              onChange={(e) => setDivisorDecimalPlaces(Number(e.target.value))}
            />
          </label>

          <label>
            割られる数(被除数)の桁数:
            <input
              type="number"
              min="1"
              value={dividendDigits}
              onChange={(e) => setDividendDigits(Number(e.target.value))}
            />
          </label>
          <label>
            割られる数(被除数)の小数桁数:
            <input
              type="number"
              min="0"
              value={dividendDecimalPlaces}
              onChange={(e) => setDividendDecimalPlaces(Number(e.target.value))}
            />
          </label>

          <label>
            商の計算方法:
            <select
              value={calcMethod}
              onChange={(e) => setCalcMethod(e.target.value)}
            >
              <option value="integer">整数で商と余りを求める</option>
              <option value="exact">割り切れるまで計算する</option>
              <option value="round">四捨五入する</option>
            </select>
          </label>

          {calcMethod === "round" && (
            <label>
              四捨五入（小数第何位）:
              <input
                type="number"
                min="0"
                value={roundPlace}
                onChange={(e) => setRoundPlace(Number(e.target.value))}
              />
            </label>
          )}

          <label>
            余りの種類:
            <select
              value={remainderOption}
              onChange={(e) => setRemainderOption(e.target.value)}
            >
              <option value="none">全部余りなし</option>
              <option value="all">全部余りあり</option>
              <option value="mixed">混合</option>
            </select>
          </label>

          <label>
            数式文字サイズ(px):
            <input
              type="number"
              min="10"
              value={mathFontSize}
              onChange={(e) => setMathFontSize(Number(e.target.value))}
            />
          </label>

          <label>
            上下余白(px):
            <input
              type="number"
              min="0"
              value={problemSpacing}
              onChange={(e) => setProblemSpacing(Number(e.target.value))}
            />
          </label>

          <label className="checkbox-label" style={{flexDirection: "row", alignItems: "center"}}>
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={(e) => setShowAnswers(e.target.checked)}
              style={{marginRight: "8px", marginTop: "0", width: "auto"}}
            />
            答えを表示する
          </label>

          <button onClick={generateProblems} style={{marginLeft: "auto", marginRight: "auto", display: "block", marginTop: "8px", width: "100%"}}>問題を生成</button>
        </div>

        <div className="problems-grid">
          {problems.map((prob, index) => {
            const latex = String.raw`\require{enclose}${prob.divisor} \enclose{longdiv}{${prob.dividend}}`;
            return (
              <div
                key={index}
                className="problem-item"
                style={{ minHeight: problemSpacing + "px", position: "relative" }}
              >
                <div className="problem-number" style={{ position: "absolute", top: "10px", left: "10px", fontWeight: "bold" }}>({index + 1})</div>
                <MathJax dynamic style={{ fontSize: mathFontSize + "px" }}>
                  {`\\(${latex}\\)`}
                </MathJax>
              </div>
            );
          })}
        </div>

        {showAnswers && problems.length > 0 && (
          <div className="answers-container">
            <h2>解答</h2>
            <div className="answers-grid">
              {problems.map((prob, index) => (
                <div key={index} className="answer-item">
                  <span className="answer-number" style={{fontWeight: "bold", marginRight: "8px"}}>({index + 1})</span>
                  {prob.answerStr}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MathJaxContext>
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default App;
