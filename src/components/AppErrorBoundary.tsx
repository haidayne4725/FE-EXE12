import { Component, type ErrorInfo, type ReactNode } from "react";

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("UI error", error, info); }
  render() {
    if (this.state.failed) return <main className="center-page"><div className="empty-state"><h1>Trang gặp sự cố</h1><p>Vui lòng tải lại để tiếp tục.</p><button onClick={() => location.reload()}>Tải lại</button></div></main>;
    return this.props.children;
  }
}
