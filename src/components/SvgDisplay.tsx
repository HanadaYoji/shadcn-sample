"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SvgDisplayProps {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

export default function SvgDisplay({
  hoveredId,
  setHoveredId,
}: SvgDisplayProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [tooltipText, setTooltipText] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  // 外部SVGを読み込む
  useEffect(() => {
    async function fetchSvg() {
      console.log("fetchSvg 1");
      const response = await fetch("/example.svg");
      console.log("fetchSvg 2");
      const text = await response.text();
      setSvgContent(text);
    }
    fetchSvg();
  }, []);

  // hoveredIdが変化したらSVGのハイライトを更新
  useEffect(() => {
    const allElements = document.querySelectorAll("svg [id]");
    allElements.forEach((el) => {
      el.setAttribute("stroke", "none");
      el.setAttribute("stroke-width", "0");
    });

    if (hoveredId) {
      const targetElement = document.getElementById(hoveredId);
      if (targetElement) {
        targetElement.setAttribute("stroke", "yellow");
        targetElement.setAttribute("stroke-width", "4");
      }
    }
  }, [hoveredId]);

  // IDに基づいたツールチップのテキストと位置を設定
  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    const targetId = (e.target as HTMLElement).id;

    if (targetId) {
      setHoveredId(targetId);

      // ツールチップのテキストを設定
      switch (targetId) {
        case "square1":
          setTooltipText("This is a blue square.");
          break;
        case "circle1":
          setTooltipText("This is an orange circle.");
          break;
        case "triangle1":
          setTooltipText("This is a purple triangle.");
          break;
        default:
          setTooltipText("Unknown shape.");
          break;
      }

      // ツールチップの位置を設定
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });
    }
  };

  const handleMouseOut = () => {
    setHoveredId(null);
    setTooltipText("");
  };

  // SVG要素に文字列を埋め込む
  const injectTextIntoSvg = (svgText: string) => {
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
    const svgRoot = svgDocument.documentElement;

    const textElements = [
      { id: "square1", text: "Square Text", x: 40, y: 60 },
      { id: "circle1", text: "Circle Text", x: 180, y: 190 },
      { id: "triangle1", text: "Triangle Text", x: 280, y: 80 },
    ];

    textElements.forEach(({ id, text, x, y }) => {
      const targetElement = svgRoot.querySelector(`#${id}`);
      if (targetElement) {
        const textNode = svgDocument.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textNode.setAttribute("x", x.toString());
        textNode.setAttribute("y", y.toString());
        textNode.setAttribute("fill", "black");
        textNode.setAttribute("font-size", "12");
        textNode.textContent = text;
        svgRoot.appendChild(textNode);
      }
    });

    return new XMLSerializer().serializeToString(svgRoot);
  };

  return (
    <div>
      <TooltipProvider>
        <div style={{ position: "relative" }}>
          {svgContent && (
            <div
              className="border"
              dangerouslySetInnerHTML={{
                __html: injectTextIntoSvg(svgContent),
              }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            ></div>
          )}
          {hoveredId && (
            <div
              style={{
                position: "absolute",
                top: tooltipPosition.y + 10, // 少し下に表示
                left: tooltipPosition.x + 10, // 少し右に表示
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
