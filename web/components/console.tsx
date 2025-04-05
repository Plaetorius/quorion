/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useEffect } from 'react'

interface ConsoleProps {
  output: any
}

export default function Console({ output }: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [output])

  return (
    <div id="console" ref={consoleRef} style={{ whiteSpace: "pre-line" }}>
      <p style={{ whiteSpace: "pre-line" }}>
        {output ? JSON.stringify(output, null, 2) : ""}
      </p>
    </div>
  )
}