import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS, H, W } from "./kit";
import {
  BrandsPeopleRemember,
  GrowthThatBringsPeopleIn,
  ShopsThatTakeOrders,
  SystemsThatSaveTime,
  WebsitesThatSell,
} from "./scenes";
import { PH, PROCESS, PW } from "./process";

/** Composition ids are the output filenames in auren/public/motion/. */
export const RemotionRoot: React.FC = () => (
  <>
    {[
      ["websites-that-sell", WebsitesThatSell],
      ["shops-that-take-orders", ShopsThatTakeOrders],
      ["brands-people-remember", BrandsPeopleRemember],
      ["growth-that-brings-people-in", GrowthThatBringsPeopleIn],
      ["systems-that-save-time", SystemsThatSaveTime],
    ].map(([id, Component]) => (
      <Composition
        key={id as string}
        id={id as string}
        component={Component as React.FC}
        durationInFrames={DURATION}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
    {PROCESS.map(([id, Component]) => (
      <Composition key={id} id={id} component={Component} durationInFrames={DURATION} fps={FPS} width={PW} height={PH} />
    ))}
  </>
);
