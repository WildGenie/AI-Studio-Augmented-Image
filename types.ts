/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type SegmentFormat = 'compact' | 'stats' | 'detailed' | 'mini';

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface ActionItem {
  label: string;
  url?: string;
}

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface Segment {
  label: string;
  format: SegmentFormat;
  description: string;
  category: 'concept' | 'data' | 'process' | 'highlight' | 'detail' | 'context';
  icon: string;
  stats?: StatItem[];
  sourceUrl?: string;
  sourceName?: string;
  actions?: ActionItem[];
  bounds: BoundingBox;
}

export interface AnalysisResult {
  segments: Segment[];
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  groundingUrls: Array<{ title: string; uri: string }>;
}