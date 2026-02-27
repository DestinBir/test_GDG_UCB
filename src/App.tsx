/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2 relative overflow-hidden font-pixel">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-30 mix-blend-overlay"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-white/5 to-transparent h-2 w-full animate-[scanline-move_4s_linear_infinite] opacity-20"></div>

      {/* Main Grid Container */}
      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-0 border-2 border-[#00ffff] bg-black shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        
        {/* Header Section */}
        <div className="lg:col-span-3 border-b-2 lg:border-b-0 lg:border-r-2 border-[#00ffff] p-6 flex flex-col justify-between bg-black relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff]"></div>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl font-bold leading-none tracking-tighter text-[#00ffff] glitch mb-2" data-text="NEON_SNAKE">
                NEON_SNAKE
              </h1>
              <div className="text-[#ff00ff] text-xl uppercase tracking-widest bg-[#ff00ff]/10 p-1 inline-block border border-[#ff00ff]">
                v2.0.4 // UNSTABLE
              </div>
            </div>

            <div className="text-[#00ffff]/80 text-lg leading-tight font-mono space-y-4">
              <p>{'>'} INITIALIZING GRID...</p>
              <p>{'>'} PROTOCOL: CONSUME</p>
              <p>{'>'} AVOID_SELF_DESTRUCTION</p>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 p-4 border border-[#ff00ff] bg-[#ff00ff]/5">
            <div className="text-[#ff00ff] text-sm mb-2 uppercase">System_Log</div>
            <div className="text-[#00ffff] text-xs font-mono h-24 overflow-hidden relative">
              <div className="animate-[pulse_0.1s_infinite]">
                0x4F2A: CONNECTION_ESTABLISHED<br/>
                0x1B3D: AUDIO_STREAM_READY<br/>
                0x9C1E: USER_DETECTED<br/>
                0x0000: WAITING_FOR_INPUT...<br/>
                0x4F2A: CONNECTION_ESTABLISHED<br/>
                0x1B3D: AUDIO_STREAM_READY
              </div>
            </div>
          </div>
        </div>

        {/* Game Center */}
        <div className="lg:col-span-6 p-8 flex items-center justify-center bg-[#050505] relative border-b-2 lg:border-b-0 border-[#00ffff]">
          {/* Decorative Corner Markers */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff00ff]"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ff00ff]"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff00ff]"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff00ff]"></div>
          
          <SnakeGame />
        </div>

        {/* Right Sidebar / Music */}
        <div className="lg:col-span-3 border-l-2 border-[#00ffff] p-0 bg-black flex flex-col">
          <div className="bg-[#00ffff] text-black p-2 font-bold text-center uppercase tracking-widest">
            Audio_Module
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center">
            <MusicPlayer />
          </div>
          <div className="border-t-2 border-[#00ffff] p-4 text-center">
             <span className="animate-pulse text-[#ff00ff] uppercase">{`>> INSERT_COIN <<`}</span>
          </div>
        </div>

      </div>
      
      <div className="fixed bottom-2 right-2 text-[#00ffff]/30 text-xs">
        SYS_ID: 409199593935
      </div>
    </div>
  );
}
