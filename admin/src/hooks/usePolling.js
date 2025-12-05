import { useState, useEffect, useRef } from 'react'

export default function usePolling(fn, interval = 30000){
  const [data,setData] = useState(null)
  const [error,setError] = useState(null)
  const mounted = useRef(true)

  useEffect(()=>{
    mounted.current = true
    let t
    const run = async ()=>{
      try{
        const r = await fn()
        if(mounted.current) setData(r)
      }catch(e){ if(mounted.current) setError(e) }
      t = setTimeout(run, interval)
    }
    run()
    return ()=>{ mounted.current = false; clearTimeout(t) }
  }, [fn, interval])

  return { data, error }
}
// https://github.com/vercel/next.js/discussions/4160