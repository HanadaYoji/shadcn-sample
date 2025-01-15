"use client";
import Image from "next/image";
import React, { useState } from "react";

const SiteMapPage = () => {
  // 位置調整用の変数を定義
  const [position, setPosition] = useState({
    top: 100, // 上からの距離（px）
    left: 100, // 左からの距離（px）
  });

  return (
    <div className="relative w-full h-screen bg-gray-200">
      {/* 背面の画像（固定位置） */}
      <div className="absolute top-0 left-0">
        <Image
          src="/img/1042-1000x900.jpg"
          alt="Background image"
          width={900}
          height={1000}
          priority
        />
      </div>

      {/* 前面に重ねる丸い画像 */}
      <div
        className={`absolute top-[${position.top}px] left-[${position.left}px]`}
      >
        <Image
          src="/img/circle_pink.png"
          alt="Overlay image"
          width={482}
          height={482}
          priority
        />
      </div>

      {/* UIパネルで位置調整 */}
      <div className="absolute top-4 right-4 p-4 bg-white shadow-lg rounded-md">
        <div className="mb-2">
          <label className="block font-bold">Top (px):</label>
          <input
            type="number"
            value={position.top}
            onChange={(e) =>
              setPosition({ ...position, top: parseInt(e.target.value, 10) })
            }
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-bold">Left (px):</label>
          <input
            type="number"
            value={position.left}
            onChange={(e) =>
              setPosition({ ...position, left: parseInt(e.target.value, 10) })
            }
            className="border rounded-md p-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SiteMapPage;
