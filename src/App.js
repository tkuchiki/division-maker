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
  const [remainderOption, setRemainderOption] = useState("mixed");
  const [mathFontSize, setMathFontSize] = useState(28);
  const [problemSpacing, setProblemSpacing] = useState(140);

  // ------------------------
  // Loading settings from cookie
  // ------------------------
  useEffect(() => {
    const savedSettings = Cookies.get("divisionSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.problemCount) setProblemCount(parsed.problemCount);
        if (parsed.divisorDigits) setDivisorDigits(parsed.divisorDigits);
        if (parsed.dividendDigits) setDividendDigits(parsed.dividendDigits);
        if (parsed.remainderOption) setRemainderOption(parsed.remainderOption);
        if (parsed.mathFontSize) setMathFontSize(parsed.mathFontSize);
        if (parsed.problemSpacing) setProblemSpacing(parsed.problemSpacing);
      } catch (err) {
        console.error("Cookie parse error:", err);
      }
    }
  }, []);

  const saveSettingsToCookie = () => {
    const settings = {
      problemCount,
      divisorDigits,
      dividendDigits,
      remainderOption,
      mathFontSize,
      problemSpacing,
    };
    Cookies.set("divisionSettings", JSON.stringify(settings), { expires: 365 });
  };

  const generateProblems = () => {
    const newProblems = [];
    for (let i = 0; i < problemCount; i++) {
      while (true) {
        const divisorMin = 10 ** (divisorDigits - 1);
        const divisorMax = 10 ** divisorDigits - 1;
        const dividendMin = 10 ** (dividendDigits - 1);
        const dividendMax = 10 ** dividendDigits - 1;

        const divisor = getRandomInt(divisorMin, divisorMax);
        const dividend = getRandomInt(dividendMin, dividendMax);

        const remainder = dividend % divisor;
        const isExact = remainder === 0;
        const hasRemainder = remainder !== 0;

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

        if (ok && divisor !== 0) {
          newProblems.push({ dividend, divisor });
          break;
        }
      }
    }
    setProblems(newProblems);

    saveSettingsToCookie();
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
              value={problemCount}
              onChange={(e) => setProblemCount(Number(e.target.value))}
              onBlur={saveSettingsToCookie}
            />
          </label>

          <label>
            割る数(除数)の桁数:
            <input
              type="number"
              value={divisorDigits}
              onChange={(e) => setDivisorDigits(Number(e.target.value))}
              onBlur={saveSettingsToCookie}
            />
          </label>

          <label>
            割られる数(被除数)の桁数:
            <input
              type="number"
              value={dividendDigits}
              onChange={(e) => setDividendDigits(Number(e.target.value))}
              onBlur={saveSettingsToCookie}
            />
          </label>

          <label>
            余りの種類:
            <select
              value={remainderOption}
              onChange={(e) => {
                setRemainderOption(e.target.value);
                saveSettingsToCookie();
              }}
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
              value={mathFontSize}
              onChange={(e) => setMathFontSize(Number(e.target.value))}
              onBlur={saveSettingsToCookie}
            />
          </label>

          <label>
            上下余白(px):
            <input
              type="number"
              value={problemSpacing}
              onChange={(e) => setProblemSpacing(Number(e.target.value))}
              onBlur={saveSettingsToCookie}
            />
          </label>

          <button onClick={generateProblems}>問題を生成</button>
        </div>

        <div className="problems-grid">
          {problems.map((prob, index) => {
            const latex = String.raw`\require{enclose}${prob.divisor} \enclose{longdiv}{${prob.dividend}}`;

            return (
              <div
                key={index}
                className="problem-item"
                style={{ minHeight: problemSpacing + "px" }}
              >
                <MathJax dynamic style={{ fontSize: mathFontSize + "px" }}>
                  {`\\(${latex}\\)`}
                </MathJax>
              </div>
            );
          })}
        </div>
      </div>
    </MathJaxContext>
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default App;
