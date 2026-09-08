export interface RagCitation { documentKey: string; sourceType: string; sourceId: string; title: string; score: number }
export interface RagChatResponse { answer: string; citations: RagCitation[]; mode: string }
export interface RagDocument { id: string; documentKey: string; sourceType: string; sourceId: string; title: string; content: string; chunkIndex: number; embedded: boolean }
export interface Knowledge { id: string; keyword: string; response: string; category: string; priority: number; active: boolean }
export interface RagIndexStatus { sourceCount: number; chunkCount: number; embeddedCount: number }
