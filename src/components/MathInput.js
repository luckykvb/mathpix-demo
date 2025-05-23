'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex' // <-- updated import

export default function MathInput() {
  const canvasRef = useRef(null)
  const [latex, setLatex] = useState('')

  const handleConvert = async () => {
    const base64 = await canvasRef.current?.exportImage('png')
    
    // Call a mock function to "parse" image to LaTeX
    const response = await fetch('https://api.mathpix.com/v3/text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'app_id': 'varun_233b6d_641b96',
            'app_key': '9ead611d01e07391e67a62fd5ea270660ec10614bed58e901927de6130036437',
        },
        body: JSON.stringify({
            src: base64,
            formats: ['latex_styled'],
            data_options: { include_asciimath: false, include_latex: true }
        }),
    })
    const data = await response.json()
    const mockLatex = data.latex_styled || ''
    //const mockLatex = '\\frac{a}{b} + c = d' // Replace this with real API call
    setLatex(mockLatex)
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Draw Math Expression</h2>
      <ReactSketchCanvas
        ref={canvasRef}
        width="400px"
        height="300px"
        strokeWidth={4}
        strokeColor="black"
      />
      <button
        onClick={handleConvert}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Convert to LaTeX
      </button>
    <button
        onClick={() => canvasRef.current?.clearCanvas()}
        className="mt-2 bg-gray-500 text-white px-4 py-2 rounded ml-2"
    >
        Clear Canvas
    </button>

      {latex && (
        <div className="mt-6">
          <h3 className="font-semibold">LaTeX Output:</h3>
          <pre className="bg-gray-100 p-2 rounded">{latex}</pre>
          <BlockMath math={latex} /> {/* <-- updated rendering */}
        </div>
      )}
    </div>
  )
}