'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Component Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Modern Developer Blog
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Built with Next.js 16, TypeScript, and Creative Technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                Explore Posts
              </button>
              <button className="px-8 py-3 border border-white hover:bg-white hover:text-black rounded-lg font-semibold transition-colors">
                About Me
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;